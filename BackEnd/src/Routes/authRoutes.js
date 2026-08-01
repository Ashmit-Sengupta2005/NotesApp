import express from "express";
import {registerUser,loginUser,logoutUser,getMe,googleLogin,googleCallback,vaultSetUp,vaultVerify} from "../Controllers/AuthControllers.js";
import { isAuthenticated } from "../MiddleWare/auth.js";
const router=express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/vault/setup",isAuthenticated,vaultSetUp);
router.post("/vault/verify",isAuthenticated,vaultVerify);
router.get("/me",getMe);
router.get("/google",googleLogin);
router.get("/google/callback",googleCallback);

export default router;