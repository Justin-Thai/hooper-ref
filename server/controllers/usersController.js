const { Users } = require('../models');
const bcrypt = require('bcryptjs');


//  @desc Creates a new user and hashes password
//  @route POST /users
//
const createUser = async (req, res) => {
    const { username, password, email } = req.body;

    const userCheck = await Users.findOne({ where: {username: username} });
    const emailCheck = await Users.findOne({ where: {email: email} });

    if (userCheck) {
        res.json({ error: "Username already taken." });
    }
    else if (emailCheck) {
        res.json({ error: "Email is already being used."});
    }
    else {
        bcrypt.hash(password, 10).then((hash) => {
            Users.create({
                username: username,
                password: hash,
                email: email,
            });
    
            res.json("SUCCESS");
        });
    }
}


module.exports = {
    createUser,
}
