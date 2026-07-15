import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../Models/User.js";
// 1. Configure Strategy
passport.use(
    new LocalStrategy({usernameField:"email"},async(email,password,done)=>{
    // done parameters: error,user,info
    try{
        const user= await User.findOne({email});
        if(!user){
            return done(null,false,{message:"Invalid email or password"});
        }
        if(!user.password){
            return done(null,false,{message:"Account registered via Google.Log in with google"});
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return done(null,false,{message:"Invalid mail or password"});
        }
        return done(null,user);
    }
    catch(error){
        console.log("Error while configuring Strategy");
        console.log(error);
        return done(error);
    }
    })
);

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser(async (id,done)=>{
    try{
        const user=await User.findById(id).select("-password");
        done(null,user);
    }
    catch(error){
        console.log("Error while deSerializing");
        done(error,null);
    }
})