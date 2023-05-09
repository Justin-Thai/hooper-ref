const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entriesController');
const verifyJWT = require('../middlewares/verifyJWT');


router.get('/', entriesController.getAllEntries);

router.post('/', verifyJWT, entriesController.createEntry);

router.get('/searchItems', entriesController.getSearchItems);

router.get('/search', entriesController.getSearchResults);

router.get('/playerCount', entriesController.getPlayerCount);


module.exports = router;