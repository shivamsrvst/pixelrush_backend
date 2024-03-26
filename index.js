const express = require('express')
const app = express()
const dotenv=require("dotenv")
const mongoose=require("mongoose")

const productRouter=require("./routes/products")
const authRouter=require("./routes/auth")
const userRouter=require("./routes/user")
const cartRouter=require("./routes/cart")
const orderRouter=require("./routes/order")
const paymentRouter=require("./routes/payment")

const port = 3001
const cors=require('cors')
app.use(cors());
dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB Connected")).catch((err)=>console.log(err))

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit:'10mb', extended:true}))


app.use('/api/products',productRouter)
app.use('/api/',authRouter)
app.use('/api/users',userRouter)
app.use('/api/cart',cartRouter)
app.use('/api/orders',orderRouter)
app.use('/api/payments',paymentRouter)

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${process.env.PORT}!`))
