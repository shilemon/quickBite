import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";
dotenv.config();
// app configurations
const app = express();
const port = process.env.PORT || 4000;
//middleware
app.use(express.json())
app.use(cors())
// DB Connection
connectDB();
// API Endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
// Http Requests
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
});
app.get('/', (req, res) => {
    res.send("API Working")
});
// To Run on port 4000
app.listen(port,()=>{
    console.log(`Server Running on http://localhost:${port}`)
})
