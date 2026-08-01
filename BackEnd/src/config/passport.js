import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { User } from "../Models/User.js";
import dotenv from "dotenv";
dotenv.config();
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

passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async(accessToken,refreshToken,profile,done)=>{
            try{
                // extract email and googleId
                const email=profile.emails[0].value;
                const googleId=profile.id;
                const username=profile.displayName||email.split("@")[0];
                //1. Check is user exists with this google ID
                let user=await User.findOne({googleId});
                if(user){
                    return done(null,user);}
                //2. Check if user exists with same gmail
                user=await User.findOne({email});
                if(user){
                    // link google account to local account
                    user.googleId=googleId;
                    await user.save();
                    return done(null,user);}
                //3. If neither, create new user
                user=await User.create({
                    username,email,googleId,});
                //No password needed for google users
                return done(null,user);}
            catch(error){
                console.error("Error in Google Strategy:", error);
                return done(error, null);
            }
        }
    )
)
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