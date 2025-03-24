import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";
// import jwtToken from "../utils/jwtwebToken.js";

const isLogin=async(req,res,next)=>{
    try {
        const token =req.cookies.jwt;
        if(!token) res.status(500).send({success:false,message:"User Unauthorized"});
        // const {id:receiverId}=req.params;
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        if(!token) res.status(500).send({success:false,message:"User Unauthorized -Invalid Token"});
        const user=await User.findById(decode.userId).select("-password");
        if(!user) res.status(500).send({success:false,message:"User not Found"});
        req.user=user;
        console.log(user._id);
        next();
    } catch (error) {
        console.log(`error in isLogin middleware ${error}`);
        res.status(500).send({success:false,message: error});
    }
};

export default isLogin;