const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports = {
  createPaymentIntent: async (req, res) => {
    const {
      amount,
      description,
      customerAddress,
      customerEmail,
    } = req.body;
    try {
      // 1. Check for existing customer by email
      const existingCustomer = await stripe.customers.list({
        email: customerEmail,
      });
      let customer;
      if (existingCustomer.data.length === 0) {
        // 2. Create customer if it doesn't exist
        customer = await stripe.customers.create({
          email: customerEmail,
          address: customerAddress,
        });
      } else {
        customer = existingCustomer.data[0]; // Use existing customer 
      }
      const paymentIntent = await stripe.paymentIntents.create({
        description: description,
        shipping: {
          name: customerEmail, // Use dynamic name
          address: customerAddress, // Use dynamic address
        },
        amount: amount,
        currency: 'usd',
        customer: customer.id, // Attach to customer 
        payment_method_types: ['card'],
      });

      res.json({ paymentIntent: paymentIntent.client_secret });
    } catch (e) {
      res.status(400).json({
        error: e.message,
      });
    }
  },
};
