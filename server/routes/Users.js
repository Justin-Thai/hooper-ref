const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middlewares/verifyJWT');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');


router.route('/')
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .post(usersController.createUser)

router.route('/:id')
    .get(usersController.getUser)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod, ROLES_LIST.User), usersController.updateUser)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod, ROLES_LIST.User), usersController.deleteUser);

router.put('/mod/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.updateUserPrivilege);


module.exports = router;