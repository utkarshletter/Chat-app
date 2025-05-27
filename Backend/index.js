import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./Route/authUser.js";
import mesageRouter from "./Route/messageRouter.js";
import cookieParser from "cookie-parser";
import userRouter from "./Route/userRout.js";
import {app,server} from "./Socket/socket.js";
import path from "path";


dotenv.config();
const Port=process.env.PORT||5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/message',mesageRouter);
app.use('/api/user',userRouter);

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

server.listen(Port,()=>{
    dbConnect();
    console.log(`Server is running at ${Port}`);
});