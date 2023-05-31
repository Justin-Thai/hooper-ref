const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
                "username": foundUser.username,
                "role": foundUser.role,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }    // CHANGE IN DEPLOYMENT
    );

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }     // CHANGE IN DEPLOYMENT
    );

    foundUser.refreshToken = refreshToken;
    const role = foundUser.role;
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
        process.env.REFRESH_TOKEN_SECRET,
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
                        "username": user.username,
                        "role": role,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
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


module.exports = {
    login,
    handleRefreshToken,
    logout,
}