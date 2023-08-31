const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis');
const nodemailer = require('nodemailer');
const processEnv = require('../config/env');

const { accessTokenSecret, refreshTokenSecret, passResetTokenSecret, emailAddress, emailPassword } = processEnv;
const mailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const DEFAULT_EXPIRATION = 600;    // Seconds
const htmlOutput = (recCode, username) => {
    return (
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>HooperRef Password Recovery Email</title>
        
        </head>
        
        <body style="
            max-height: 1500px;
            max-width: 750px;
            background-color: #191414; 
            color: #ffffff; 
            font-size: 16px;
            font-family: sans-serif, Helvetica, Arial;
            padding: 25px;"
        >
            <div style="font-size: 2rem; margin-top: 25px; margin-bottom: 25px;">HooperRef</div>
            <hr style="margin-bottom: 50px; color: #bbbbbb;">
            <div style="margin-bottom: 15px;">Hello ${username}!</div>
            <div style="margin-bottom: 15px;">Did you request to reset your password for your HooperRef account?</div>
            <div style="margin-bottom: 15px;">If so, please use the code below to reset your password. <strong>The code will expire in 10 minutes.</strong></div>
            <div style="margin-bottom: 15px;">
                <div style="
                    width: 100px; 
                    height: 40px;
                    background-color: #bbbbbb;
                    color: #191414;
                    font-size: 1.5rem;
                    border-radius: 15px;
                    text-align: center;
                    padding-top: 15px;
                    margin: auto;"
                >
                    ${recCode}
                </div>
            </div>
            <div style="margin-bottom: 15px;">If you did not request a password reset code, please ignore this email.</div>
            <div style="margin-bottom: 50px;">Thank you for continuing to be a part of the HooperRef community!</div>
            <div>- The HooperRef Team &#127936;</div>
        </body>
        
        </html>`
    );
};

//  @desc Logs in the user to their account if credentials are valid
//  @route POST /auth
//
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const foundUser = await Users.findOne({ where: { username: username } });
    if (!foundUser) {
        return res.status(401).json({ message: "Username not found." });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        return res.status(401).json({ message: "Wrong username or password." });
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser.id,
                "username": foundUser.username,
                "role": foundUser.role,
            }
        },
        accessTokenSecret,
        { expiresIn: '10m' }    // CHANGE IN DEPLOYMENT
    );

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        refreshTokenSecret,
        { expiresIn: '1d' }     // CHANGE IN DEPLOYMENT
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,   // UNCOMMENT IN DEPLOYMENT
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,    // CHANGE IN DEPLOYMENT
    });

    return res.json({ accessToken });
}

//  @desc Gets a refresh token
//  @route GET /auth/refresh
//
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    const foundUser = await Users.findOne({ where: { refreshToken: refreshToken } });
    if (!foundUser) {
        return res.status(403).json({ message: "Forbidden" });
    }

    jwt.verify(
        refreshToken,
        refreshTokenSecret,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const user = await Users.findOne({ where: { username: decoded.username } });
            if (!user) {
                return res.status(401).json({ message: "Username not found." });
            }

            const role = user.role;
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": user.id,
                        "username": user.username,
                        "role": role,
                    }
                },
                accessTokenSecret,
                { expiresIn: '10m' }    // CHANGE IN DEPLOYMENT
            );

            return res.json({ accessToken });
        }
    );
}

//  @desc Log outs the user
//  @route POST /auth/logout
//
const logout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await Users.findOne({ where: { refreshToken: refreshToken } });
    if (!foundUser) {
        res.clearCookie('jwt',
            {
                httpOnly: true,
                sameSite: 'None',
                secure: true,   // UNCOMMENT IN DEPLOYMENT
            }
        );

        return res.sendStatus(204);
    }

    foundUser.refreshToken = null;
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt',
        {
            httpOnly: true,
            sameSite: 'None',
            secure: true,   // UNCOMMENT IN DEPLOYMENT
        }
    );

    return res.json("Cookie cleared");
}

//  @desc Sends an email that contains a verification code for resetting a password
//  @route POST /auth/sendRecoveryCode
//
const sendRecoveryCode = async (req, res) => {
    const email = req.body?.email;

    if (!email) {
        return res.status(400).json({ message: "Email is required to send the code." });
    }

    if (!mailRegex.test(email)) {
        return res.status(400).json({ message: "An invalid email was entered." });
    }

    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
        return res.status(401).json({ message: `No user is registered with the email ${email}.` });
    }

    try {
        const recCode = Math.floor((Math.random() * 90000) + 10000);
        await redisClient.setEx(`recoveryOTP:${user.username}`, DEFAULT_EXPIRATION, recCode.toString());

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailAddress,
                pass: emailPassword
            }
        });

        let mailOptions = {
            from: `HooperRef <${emailAddress}>`,
            to: user.email,
            subject: 'Your password recovery code',
            html: htmlOutput(recCode, user.username)
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            }

            return res.json(info?.messageId);
        });
    }
    catch (err) {
        console.error(err);
    }
}

//  @desc Verifies the submitted recovery code and returns a JSON web token if verified
//  @route POST /auth/checkRecoveryCode
//
const checkRecoveryCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        res.status(400).json({ message: "All fields are required." });
    }

    if (!mailRegex.test(email)) {
        return res.status(400).json({ message: "An invalid email was entered." });
    }

    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
        return res.status(401).json({ message: `No user is registered with the email ${email}.` });
    }

    try {
        const recCode = await redisClient.get(`recoveryOTP:${user.username}`);
        if (!recCode) {
            return res.status(400).json({ message: `The code sent to ${email} has already expired.` });
        }

        if (code !== recCode) {
            return res.status(401).json({ message: "The submitted code is incorrect." });
        }

        redisClient.del(`recoveryOTP:${user.username}`);
        const resetToken = jwt.sign(
            { 'username': user.username },
            passResetTokenSecret,
            { expiresIn: '10m' }
        );
        await redisClient.setEx(`resetToken:${user.username}`, DEFAULT_EXPIRATION, resetToken);

        return res.json({ user: user.username, resetToken: resetToken });
    }
    catch (err) {
        console.error(err);
    }
}

//  @desc Resets user's password if reset token is valid
//  @route PATCH /auth/resetPassword/:user/:resetToken
//
const resetPassword = async (req, res) => {
    if (!req?.body?.password || !req?.body?.confirmPass ) {
        return res.status(400).json({ message: "All fields are required."});
    }

    if (!req?.params?.user) {
        return res.status(400).json({ message: "Username is required." });
    }

    if (!req?.params?.resetToken) {
        return res.status(400).json({ message: "Reset token is required." });
    }

    const token = await redisClient.get(`resetToken:${req.params.user}`);
    if (!token) {
        return res.status(400).json({ message: `The password reset link for ${req.params.user} expired or does not exist.` })
    }
    if (req.params.resetToken !== token) {
        return res.status(401).json({ message: "Invalid reset token." });
    }

    jwt.verify(
        req.params.resetToken,
        passResetTokenSecret,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const user = await Users.findOne({ where: { username: decoded.username } });
            if (!user) {
                return res.status(401).json({ message: "Username not found." });
            }

            if (req.body.password !== req.body.confirmPass) {
                return res.status(400).json({ message: "Passwords don't match."});
            }
            
            await bcrypt.hash(req.body.password, 10).then((hash) => {
                user.password = hash;
            });
            redisClient.del(`resetToken:${user.username}`);

            const result = await user.save();
            return res.json(result);
        }
    );
}

module.exports = {
    login,
    handleRefreshToken,
    logout,
    sendRecoveryCode,
    checkRecoveryCode,
    resetPassword
}