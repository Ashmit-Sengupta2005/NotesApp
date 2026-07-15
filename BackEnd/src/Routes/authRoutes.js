import express from "express";
import {registerUser,loginUser,logoutUser,getMe} from "../Controllers/AuthControllers.js";
const router=express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.get("/me",getMe);
export default router;