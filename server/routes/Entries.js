const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entriesController');
const verifyJWT = require('../middlewares/verifyJWT');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');


router.route('/')
    .get(entriesController.getAllEntries)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod, ROLES_LIST.User), entriesController.createEntry)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod), entriesController.updateEntry)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Mod), entriesController.deleteEntry);

router.get('/searchItems', entriesController.getSearchItems);

router.get('/search', entriesController.getSearchResults);

router.get('/playerCount', entriesController.getPlayerCount);


module.exports = router;