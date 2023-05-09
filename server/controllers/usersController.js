const { Users } = require('../models');
const bcrypt = require('bcryptjs');


//  @desc Creates a new user and hashes password
//  @route POST /users
//
const createUser = async (req, res) => {
    const { username, password, email } = req.body;

    const userCheck = await Users.findOne({ where: { username: username } });
    const emailCheck = await Users.findOne({ where: { email: email } });

    if (userCheck) {
        return res.status(409).json({ error: "Username already taken." });
    }
    else if (emailCheck) {
        return res.status(409).json({ error: "Email is already being used." });
    }

    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
            email: email,
        });

        return res.status(201).json("SUCCESS");
    });
}


module.exports = {
    createUser,
}
