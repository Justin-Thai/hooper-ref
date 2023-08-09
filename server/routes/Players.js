const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');
const verifyJWT = require('../middlewares/verifyJWT');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');


router.route('/')
    .get(playersController.getAllPlayers)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod), playersController.createPlayer)
    
router.route('/:playerCode').get(playersController.getPlayer);

router.route('/:id')
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod), playersController.updatePlayer)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod), playersController.deletePlayer);


module.exports = router;