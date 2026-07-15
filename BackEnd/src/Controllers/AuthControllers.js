import { User } from "../Models/User.js";
import passport from "passport";
import bcrypt from "bcryptjs";
// This page is dedicated to local 
//Register
export const registerUser=async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        // Validation
        if(!username||!email||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        // User already exists or not
        const checkUser=await User.findOne({email});
        if(checkUser){
            return res.status(400).json({message:"User already exists with same email"});
        }
        //Generate Salt + Hash
        const salt=await bcrypt.genSalt(11);
        const hashedPassword=await bcrypt.hash(password,salt);
        // save user to db
        const newUser= new User({
            username,email,password:hashedPassword
        });
        await newUser.save();
        //auto-login after registration( default provided by password)
        req.login(newUser,(err)=>{
            if(err) return next(err);
            const userResponse={
                id:newUser._id,
                username:newUser.username,
                email:newUser.email};
        return res.status(201).json({message:"User registered and logged in successfully",user:userResponse});
        });
    }
    catch(error){
        console.log("Error in registration: ",error.message);
        res.status(500).json({message:"Registration Failed.Internal Server Error"});
    }
}

//Login

export const loginUser=(req,res,next)=>{
    passport.authenticate("local",(err,user,info)=>{
        if(err){
            return next(err);}
        if(!user){
            return res.status(400).json({message:info?.message||"Login Failed"});
        }
        req.login(user,(err)=>{
            if(err){
                return next(err);
            }
            const userResponse={
                id:user._id,
                username:user.username,
                email:user.email,};
            return res.status(200).json({message:"User logged in successfully",user:userResponse});});
    })(req, res, next);
};

//LogOut

export const logoutUser=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);}
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).json({message:"Failed to destroy logout session"});
        }
    res.clearCookie("connect.sid");
    return res.status(200).json({message:"Logged out Successfully"});
    });
    });
};

// Check Authentication Status (GetMe)

export const getMe=(req,res)=>{
    if(req.isAuthenticated()){
        const userResponse={
                id:req.user._id,
                username:req.user.username,
                email:req.user.email};
    return res.status(200).json({isAuthenticated:true,user:userResponse});  
    }
    return res.status(200).json({isAuthenticated:false,user:null});
};