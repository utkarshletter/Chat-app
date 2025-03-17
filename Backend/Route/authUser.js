import express from "express";
import { userRegister } from "../routControllers/userroutControllers.js";
import { userLogin } from "../routControllers/userroutControllers.js";
import { userLogout } from "../routControllers/userroutControllers.js";


const router=express.Router();

router.post("/register",userRegister);

router.post("/login",userLogin);

router.post("/logout",userLogout);

export default router;