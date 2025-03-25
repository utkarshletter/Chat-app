import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./Route/authUser.js";
import mesageRouter from "./Route/messageRouter.js";
import cookieParser from "cookie-parser";
import userRouter from "./Route/userRout.js";

const app=express();


dotenv.config();
const Port=process.env.PORT||3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/message',mesageRouter);
app.use('/api/user',userRouter);

app.get("/",(req,res)=>{
    res.send("server is working");
});

app.listen(Port,()=>{
    dbConnect();
    console.log(`Server is running at ${Port}`);
});