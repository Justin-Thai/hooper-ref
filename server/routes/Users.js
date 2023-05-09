const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middlewares/verifyJWT');


router.post('/', usersController.createUser);


module.exports = router;