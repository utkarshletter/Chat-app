import express from "express";
import { userRegister,userLogin,userLogout } from "../routControllers/userroutControllers.js";


const router=express.Router();

router.post("/register",userRegister);

router.post("/login",userLogin);

router.post("/logout",userLogout);

export default router;