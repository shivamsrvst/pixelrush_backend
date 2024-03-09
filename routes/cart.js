const router=require("express").Router();
const cartController=require("../controllers/cartController");
const {verifyToken}=require('../middleware/verifyToken');




router.get("/find/:userId",verifyToken,cartController.getCart);
router.post("/",verifyToken,cartController.addToCart);
router.put("/quantity",verifyToken,cartController.decrementCartItem);
router.delete("/:cartItemId",verifyToken,cartController.deleteCartItem);







module.exports=router;