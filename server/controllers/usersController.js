const { Users, Entries, Sequelize } = require('../models');
const Op = Sequelize.Op;
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary');


const imageSignatures = {
    png: "iVBORw0KGgo",
    jpg: "/9j/"
};

//  @desc Gets all users
//  @route GET /api/users
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
        return res.status(204).json({ message: "No users found." });
    }

    return res.json(users);
}

//  @desc Creates a new user and hashes password
//  @route POST /api/users
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
//  @route GET /api/users/:username
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
            'role',
            'image_url'
        ]
    });

    if (!user) {
        return res.status(204).json({ message: "No user found" });
    }

    return res.json(user);
}

//  @desc Updates a user's info 
//  @route PUT /api/users/:id
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

    if (req.body?.username) {
        if (req.body.username !== user.username) {
            const userCheck = await Users.findOne({ where: { username: req.body.username } });
            if (userCheck) {
                return res.status(409).json({ message: "Username already taken." });
            }

            user.username = req.body.username;
        }
    }

    if (req.body?.email) {
        if (req.body.email !== user.email) {
            const emailCheck = await Users.findOne({ where: { email: req.body?.email } });
            if (emailCheck) {
                return res.status(409).json({ message: "Email is already being used." });
            }

            user.email = req.body.email;
        }
    }

    if (req.body?.password) {
        if (req.body.password !== req.body.confirmPass) {
            return res.status(400).json({ message: "New password fields don't match." });
        }

        await bcrypt.hash(req.body.password, 10).then((hash) => {
            user.password = hash;
        });
    }

    if (req.body?.image) {
        const b64String = req.body.image.split(',')[1];
        if (!b64String.startsWith(imageSignatures.png) && !b64String.startsWith(imageSignatures.jpg)) {
            return res.status(415).json({ message: "Submitted file is not a JPEG or PNG file." });
        }

        if (user.image_public_id && user.image_url) {
            await cloudinary.uploader.destroy(user.image_public_id);
        }

        const result = await cloudinary.uploader.upload(req.body.image, {
            folder: "hooperref-profile-pictures"
        });
        user.image_public_id = result.public_id;
        user.image_url = result.url;
    }

    const result = await user.save();
    return res.json(result);
}

//  @desc Deletes a user
//  @route DELETE /api/users/:id
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
//  @route PUT /api/users/mod/:id
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

// @desc Gets a list of users' usernames (for searching purposes)
// @route GET /api/users/search/names
//
const getUserNames = async (req, res) => {
    const listOfNames = await Users.findAll({
        attributes: ['username']
    });

    if (!listOfNames) {
        return res.status(204).json({ message: "No users found." });
    }

    const resList = [];
    listOfNames.map((value) => {
        resList.push(value.username);
    });

    return res.json(resList);
}

// @desc Gets all users based on search query
// @route GET /api/users/search/user
//
const getUserSearchResults = async (req, res) => {
    const query = req.query.q.toLowerCase();

    const listOfUsers = await Users.findAll({
        where: Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('username')),
            {
                [Op.like]: '%' + query + '%'
            }
        ),
        attributes: [
            'username',
            'image_url'
        ]
    });

    listOfUsers.sort((a, b) => {
        return a.username.localeCompare(b.name);
    });

    return res.json(listOfUsers);
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    updateUserPrivilege,
    getUserNames,
    getUserSearchResults
}