const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entriesController');


router.get('/', entriesController.getAllEntries);

router.post('/', entriesController.createEntry);

router.get('/searchItems', entriesController.getSearchItems);

router.get('/search', entriesController.getSearchResults);

router.get('/playerCount', entriesController.getPlayerCount);


module.exports = router;