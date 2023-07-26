const { Users, Entries, Sequelize } = require('../models');
const bcrypt = require('bcryptjs');

//  @desc Gets all users
//  @route GET /users
//
const getAllUsers = async (req, res) => {
    const users = await Users.findAll({
        attributes: [
            'id',
            'username',
            'createdAt',
            'role',
            [Sequelize.fn('COUNT', Sequelize.col('Entries.id')), 'numEntries'],
        ],
        include: [
            {
                model: Entries,
                attributes: []
            },
        ],
        group: ['Users.id']
    });

    if (!users) {
        return res.status(204).json({ message: "No users found" });
    }

    return res.json(users);
}

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

//  @desc Gets a user based on given username
//  @route GET /users/:username
//
const getUser = async (req, res) => {
    if (!req?.params?.username) {
        return res.status(400).json({ message: "Username is required." });
    }

    const user = await Users.findOne({
        where: { username: req.params.username },
        attributes: [
            'id',
            'username',
            'email',
            'createdAt',
            'role'
        ]
    });

    if (!user) {
        return res.status(204).json({ message: "No user found" });
    }

    return res.json(user);
}

//  @desc Updates a user's info 
//  @route PUT /users/:id
//
const updateUser = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const userId = Number(req.params.id);

    if (userId !== req.id) {
        return res.status(401).json({ message: "Forbidden. You can only update your own profile." });
    }

    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(204).json({ message: `No user matches ID ${userId}.` });
    }

    const match = await bcrypt.compare(req.body?.oldPass, user.password);
    if (!match) {
        return res.status(401).json({ message: "Current password is incorrect." })
    }

    if (req.body?.username !== user.username) {
        const userCheck = await Users.findOne({ where: { username: req.body.username } });
        if (userCheck) {
            return res.status(409).json({ message: "Username already taken." });
        }

        user.username = req.body.username;
    }

    if (req.body?.email !== user.email) {
        const emailCheck = await Users.findOne({ where: { email: req.body?.email } });
        if (emailCheck) {
            return res.status(409).json({ message: "Email is already being used." });
        }

        user.email = req.body.email;
    }

    if (req.body?.password) {
        if (req.body.password !== req.body.confirmPass) {
            return res.status(400).json({ message: "New password fields don't match." });
        }

        await bcrypt.hash(req.body.password, 10).then((hash) => {
            user.password = hash;
        });
    }

    const result = await user.save();
    return res.json(result);
}

//  @desc Deletes a user
//  @route DELETE /users/:id
//
const deleteUser = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const userId = Number(req.params.id);

    if (userId !== req.id) {
        return res.status(401).json({ message: "Forbidden. You can only delete your own profile." });
    }

    const user = await Users.findByPk(userId);

    if (!user) {
        return res.status(204).json({ message: `No user matches ID ${userId}.` });
    }

    const result = await user.destroy();
    return res.json(result);
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
    getUser,
    updateUser,
    deleteUser,
    updateUserPrivilege
}
