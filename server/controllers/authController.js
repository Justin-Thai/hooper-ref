const { Users } = require('../models');
const bcrypt = require('bcryptjs');


//  @desc Logs in the user to their account if credentials are valid
//  @route POST /auth
//
const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });

    if (!user) {
        res.json({ error: "Username not found." });
    }
    else {
        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) {
                res.json({ error: "Wrong username or password." });
            }
            else {
                res.json("LOGGED IN");
            }
        });
    }
}


module.exports = {
    login,
}