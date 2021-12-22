const express = require("express");
const router = express.Router();

//const bookController= require('../controller/bookController')
//const reviewController= require('../controller/reviewController')
const userController= require('../controller/userController')
//const middleware = require('../middleware/loginmiddle')

//user api 
 router.post("/register", userController.createUser)
 //router.post("/login", userController.loginUser)

module.exports = router;