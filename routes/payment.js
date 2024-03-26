const express = require('express');
const { verifyToken } = require("../middleware/verifyToken");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

router.post('/intents',paymentController.createPaymentIntent)

module.exports = router;