import express from "express";
import isLogin from "../middleware/isLogin.js";
import {getUserBySearch,getcurrentchatters} from "../routControllers/userhandlerRout.js";

const router=express.Router();

router.get("/search",isLogin,getUserBySearch);
router.get("/getcurrentchatters",isLogin,getcurrentchatters);


export default router;