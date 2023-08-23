const { Users, Entries, Sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary');
const redisClient = require('../utils/redis');
const nodemailer = require('nodemailer');

const imageSignatures = {
    png: "iVBORw0KGgo",
    jpg: "/9j/"
};
const mailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const DEFAULT_EXPIRATION = 600;    // Seconds
const htmlOutput = (recCode, username) => {
    return (
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>HooperRef Password Recovery Email</title>
        
        </head>
        
        <body style="
            max-height: 1500px;
            max-width: 750px;
            background-color: #191414; 
            color: #ffffff; 
            font-size: 16px;
            font-family: sans-serif, Helvetica, Arial;
            padding: 25px;"
        >
            <div style="font-size: 2rem; margin-top: 25px; margin-bottom: 25px;">HooperRef</div>
            <hr style="margin-bottom: 50px; color: #bbbbbb;">
            <div style="margin-bottom: 15px;">Hello ${username}!</div>
            <div style="margin-bottom: 15px;">Did you request to reset your password for your HooperRef account?</div>
            <div style="margin-bottom: 15px;">If so, please use the code below to reset your password. <strong>The code will expire in 10 minutes.</strong></div>
            <div style="margin-bottom: 15px;">
                <div style="
                    width: 100px; 
                    height: 40px;
                    background-color: #bbbbbb;
                    color: #191414;
                    font-size: 1.5rem;
                    border-radius: 15px;
                    text-align: center;
                    padding-top: 15px;
                    margin: auto;"
                >
                    ${recCode}
                </div>
            </div>
            <div style="margin-bottom: 15px;">If you did not request a password reset code, please ignore this email.</div>
            <div style="margin-bottom: 50px;">Thank you for continuing to be a part of the HooperRef community!</div>
            <div>- The HooperRef Team &#127936;</div>
        </body>
        
        </html>`
    );
};

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
        return res.status(204).json({ message: "No users found." });
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

//  @desc Sends an email that contains a verification code for resetting a password
//  @route POST /users/sendRecoveryCode
//
const sendRecoveryCode = async (req, res) => {
    const email = req.body?.email;

    if (!email) {
        return res.status(400).json({ message: "Email is required to send the code." });
    }

    if (!mailRegex.test(email)) {
        return res.status(400).json({ message: "An invalid email was entered." });
    }

    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
        return res.status(204).json({ message: `No user is registered with the email ${email}.` });
    }

    try {
        const recCode = Math.floor((Math.random() * 90000) + 10000);
        await redisClient.setEx(`recoveryOTP:${user.username}`, DEFAULT_EXPIRATION, recCode.toString());

        // const transporter = nodemailer.createTransport({
        //     service: 'smtp.gmail.com',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         email: process.env.EMAIL_ADDRESS,
        //         password: process.env.EMAIL_PASSWORD
        //     },
        //     tls: {
        //         rejectUnauthorized: false
        //     }
        // });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: `HooperRef <${process.env.EMAIL_ADDRESS}>`,
            to: user.email,
            subject: 'Your password recovery code',
            html: htmlOutput(recCode, user.username)
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            }

            res.json(info?.messageId);
        });
    }
    catch (err) {
        console.error(err);
    } 
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    updateUserPrivilege,
    sendRecoveryCode
}