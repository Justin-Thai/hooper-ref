const express = require('express');
const router = express.Router();
const subsController = require('../controllers/submissionsController');
const verifyJWT = require('../middlewares/verifyJWT');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');


router.route('/')
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod), subsController.getAllSubs)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod, ROLES_LIST.User), subsController.createSub)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod), subsController.deleteSub);
 

module.exports = router;
