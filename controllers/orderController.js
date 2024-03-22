const Order=require('../models/Order');

module.exports = {
  createOrder: async (req, res) => {
    try {
      const {
        orderId,
        userId,
        products,
        subtotal,
        total,
        paymentStatus,
        deliveryStatus,
      } = req.body;

      // Create a new order instance
      const newOrder = new Order({
        orderId,
        userId,
        products,
        subtotal,
        total,
        paymentStatus,
        deliveryStatus,
      });

      // Save the new order to the database
      const savedOrder = await newOrder.save();

      // Send a success response
      res.status(201).json(savedOrder);
    } catch (error) {
      // If an error occurs, send an error response
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Could not create order" });
    }
  },
  getUserOrders: async (req, res) => {
    const userId = req.user.id;

    try {
      const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });

      res.status(200).json(userOrders);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};