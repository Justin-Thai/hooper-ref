const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middlewares/verifyJWT');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');

router.route('/')
    .post(usersController.createUser)
    .get(usersController.getAllUsers)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod, ROLES_LIST.User), usersController.updateUser)
    // .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod, ROLES_LIST.User), usersController.deleteUser);

module.exports = router;