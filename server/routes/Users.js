const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcryptjs');


router.post('/', async (req, res) => {
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
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = await Users.findOne({ where: {username: username} });
   
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
});

module.exports = router;