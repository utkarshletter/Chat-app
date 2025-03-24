import express from "express";
import isLogin from "../middleware/isLogin.js";
import { getMessage,sendMessage } from "../routControllers/messageroutControllers.js";

const router = express.Router();

router.post("/send/:id",isLogin,sendMessage);
router.get("/:id",isLogin,getMessage);

export default router;