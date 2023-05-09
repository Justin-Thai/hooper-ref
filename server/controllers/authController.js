const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//  @desc Logs in the user to their account if credentials are valid
//  @route POST /auth
//
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const user = await Users.findOne({ where: { username: username } });

    if (!user) {
        return res.status(401).json({ error: "Username not found." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ error: "Wrong username or password." });
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": user.username,
                "role": user.role,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }    // CHANGE IN DEPLOYMENT
    );

    const refreshToken = jwt.sign(
        { "username": user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }     // CHANGE IN DEPLOYMENT
    );

    res.cookie('jwt', refreshToken, {
        httpOnly: true,  
        // secure: true,   // UNCOMMENT IN DEPLOYMENT
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,    // CHANGE IN DEPLOYMENT
    });

    return res.json({ accessToken });
}

//  @desc Gets a refresh token
//  @route GET /auth/refresh
//
const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const user = await Users.findOne({ where: { username: decoded.username } });

            if (!user) {
                return res.status(401).json({ error: "Username not found." });
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": user.username,
                        "role": user.role,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }    // CHANGE IN DEPLOYMENT
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

    if (!cookies.jwt) {
        return res.sendStatus(204);
    }

    res.clearCookie('jwt',
        {
            httpOnly: true,
            sameSite: 'None',
            // secure: true,   // UNCOMMENT IN DEPLOYMENT
        }
    );

    return res.json("Cookie cleared");
}


module.exports = {
    login,
    refresh,
    logout,
}