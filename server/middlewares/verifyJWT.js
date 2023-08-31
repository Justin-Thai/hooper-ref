const jwt = require('jsonwebtoken');
const processEnv = require('../config/env');

const { accessTokenSecret } = processEnv;
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        accessTokenSecret,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }
            req.id = decoded.UserInfo.id;
            req.user = decoded.UserInfo.username;
            req.role = decoded.UserInfo.role;
            next();
        }
    );
};

module.exports = verifyJWT;