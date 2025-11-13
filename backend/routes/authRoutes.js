const express = require('express');
 const router =express.Router(); // Create a new router instance 
const {signup,login} =require('../controllers/authController');

router.post('/signup',signup); // Route for user signup
router.post('/login',login); // Route for user login

module.exports=router;