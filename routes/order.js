const router=require('express').Router();
const ordersController=require('../controllers/orderController');
const {verifyToken}=require('../middleware/verifyToken')


// Route to create a new order
router.post('/',verifyToken, ordersController.createOrder);

// Route to fetch orders for a user
router.get('/:userId',verifyToken, ordersController.getUserOrders);




module.exports=router;