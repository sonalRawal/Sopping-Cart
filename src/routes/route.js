const express = require("express");
const router = express.Router();
const userController= require('../controller/userController')
const productController= require('../controller/productController')

const usermid = require('../middleware/userMiddleware')


//user api 
 router.post("/register",usermid.urlOfProfileImage, userController.createUser)
 router.post('/login' ,  userController.loginUser);
 router.get('/user/:userId/profile' ,usermid.mid1, userController.getUserProfileById);
router.put('/user/:userId/profile',usermid.mid1, usermid.urlOfProfileImageForUpdate, userController.updateUser);

//product api
router.post("/products", usermid.urlOfProfileImage, productController.createProduct)
router.put('/products/:productId' , usermid.urlOfProfileImageForUpdate, productController.updateProduct);
router.get('/products', productController.getProduct)
router.get('/products/:productId', productController.getProductById)
router.delete('/products/:productId', productController.deleteProduct)
module.exports = router;