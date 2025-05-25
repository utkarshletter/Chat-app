import jwt from "jsonwebtoken";

const jwtToken=(userId,res)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'30d'
    });
    // console.log("cookie came");
    res.cookie("jwt",token,{
        maxAge:30 *24 *60 *60 *1000,
        httpOnly:true,
        sameSite:"strict",
        secure:false
    });
    console.log("Cookie set:", res.getHeaders()["set-cookie"]);
}

export default jwtToken;