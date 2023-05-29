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
        return res.status(409).json({ message: "Username already taken." });
    }
    else if (emailCheck) {
        return res.status(409).json({ message: "Email is already being used." });
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

//  @desc Gets all users
//  @route GET /users
//
const getAllUsers = async (req, res) => {
    const users = await Users.findAll();
    
    if (!users) {
        return res.status(204).json({ message: "No users found" });
    }

    return res.json(users);
}

//  @desc Updates a user's info
//  @route PUT /users
//
const updateUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const user = await Users.findOne({ where: { id: req.body.id } });
    if (!user) {
        return res.status(204).json({ message: `No user matches ID ${req.body.id}.` });
    }

    if (req.body?.username) {
        const userCheck = await Users.findOne({ where: { username: req.body.username } });
        if (userCheck) {
            return res.status(409).json({ message: "Username already taken." });
        }

        user.username = req.body.username;
    }

    if (req.body?.email) {
        const emailCheck = await Users.findOne({ where: { email: req.body?.email } });
        if (emailCheck) {
            return res.status(409).json({ message: "Email is already being used." });
        }

        user.email = req.body.email;
    }

    if (req.body?.password && req.body?.oldPass) {
        const oldPassMatch = await bcrypt.compare(req.body.oldPass, user.password);   
        if (!oldPassMatch) {
            return res.status(401).json({ message: "Old password does not match." });
        }

        await bcrypt.hash(req.body.password, 10).then((hash) => {
            user.password = hash;
        });
    }

    const result = await user.save();
    return res.json(result);
}

//  @desc Deletes a user
//  @route DELETE /users
//
const deleteUser = async (req, res) => {
    return;
}

//  @desc Updates a user's privilege
//  @route PUT /users/mod/:id
//
const updateUserPrivilege = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "User ID is required." });
    }
    
    const user = await Users.findOne({ where: { id: req.params.id } });
    if (!user) {
        return res.status(204).json({ message: `No user matches ID ${req.params.id}.` });
    }

    const userRole = user.role;
    
    if (userRole === "mod") {
        user.role = "user";
    }
    else if (userRole === "user") {
        user.role = "mod";
    }

    const result = await user.save();
    return res.json(result);
}

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    updateUserPrivilege
}
