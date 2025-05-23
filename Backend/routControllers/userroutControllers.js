import User from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";

export const userRegister=async(req,res)=>{
    try {
        const {fullname,username,email,gender,password,profilepic}=req.body;
        const user=await User.findOne({username,email});
        if(user) return res.status(500).send({success:false,message:"Username or Email already exists"});
        const hashPassword=bcrypt.hashSync(password,10);//or use await hash
        const profileBoy=profilepic ||`https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl=profilepic ||`https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser=new User({
            fullname,
            username,
            email,
            gender,
            password:hashPassword,
            profilepic:gender==="male"?profileBoy:profileGirl,
        });
        if(newUser){
            await newUser.save();
            jwtToken(newUser._id,res);
        }
        else{
            res.status(500).send({success:false,message:"Invalid user data"});
        }

        res.status(201).send({
            _id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            profilepic:newUser.profilepic,
            email:newUser.email,
        });


    } catch (error) {
        res.status(500).send({
            success:false,
            message:error,
        })
        console.log(error);
    }
}

export const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).send({
          success: false,
          message: "Email doesn't exist",
        });
      }
  
      const comparePass = bcrypt.compareSync(password, user.password || "");
      if (!comparePass) {
        return res.status(400).send({
          success: false,
          message: "Wrong Password",
        });
      }
  
      jwtToken(user._id, res);
  
      res.status(200).send({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        profilepic: user.profilepic,
        email: user.email,
        message: "Successfully Login",
      });
  
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).send({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
  


export const userLogout=async(req,res)=>{
    try {
        res.cookie("jwt",'',{
            maxAge:0
        });
        res.status(200).send({message:"User Logout"});
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error,
        })
        console.log(error);
    }
};