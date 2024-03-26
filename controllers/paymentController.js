const dotenv = require('dotenv');
dotenv.config()
const stripe=require('stripe')(process.env.STRIPE_SECRET);

module.exports={
    createPaymentIntent:async(req,res)=>{
        const { amount, cartItems, userId,description } = req.body;
        console.log("Cart Items Coming From Frontend for Database:",cartItems);
        console.log("userId Coming from the backend:",userId);
        console.log("Price Coming From the Frontend after including the shipping charge:",amount);
        try {
            const paymentIntent=await stripe.paymentIntents.create({
                amount:amount,
                currency:'usd',
                description:description,
                payment_method_types: ['card']
            })
            console.log(paymentIntent);
            res.json({paymentIntent:paymentIntent.client_secret});
            
        }catch (e) {
            res.status(400).json({
              error: e.message,
            });
          }

    }

}