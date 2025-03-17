import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./Route/authUser.js";

const app=express();


dotenv.config();
const Port=process.env.PORT||3000;

app.use(express.json());

app.use('/api/auth',authRouter);

app.get("/",(req,res)=>{
    res.send("server is working");
});

app.listen(Port,()=>{
    dbConnect();
    console.log(`Server is running at ${Port}`);
});