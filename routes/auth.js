const router=require("express").Router();
const authController=require("../controllers/authController");


router.post('/register',authController.createUser)
router.post('/login',authController.loginUser)
router.post('/forgotpassword',authController.forgotPassword)
router.post('/reset-password', authController.resetPassword);

module.exports=router;
