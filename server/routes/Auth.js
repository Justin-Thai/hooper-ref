const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middlewares/loginLimiter');


router.post('/', loginLimiter, authController.login);

router.get('/refresh', authController.handleRefreshToken);

router.post('/logout', authController.logout);

router.post('/sendRecoveryCode', authController.sendRecoveryCode);

router.post('/checkRecoveryCode', authController.checkRecoveryCode);

router.patch('/resetPassword/:user/:resetToken', authController.resetPassword);

module.exports = router;