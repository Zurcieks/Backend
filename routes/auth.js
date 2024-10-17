const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
 

// Logowanie użytkownika
router.post('/login', loginUser);

 
module.exports = router;
