const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/login', (req, res) => {
	res.status(405).json({ message: 'Use POST with credentials to authenticate.' });
});

router.post('/login', authController.login);
router.post('/register/owner', authController.registerOwner);

module.exports = router;
