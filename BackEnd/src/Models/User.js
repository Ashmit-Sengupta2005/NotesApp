import mongoose from "mongoose";
//1-> Create a schema 
//2->model based off that schema
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true, // always needed for google/local
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,// may not be required for google logins
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    }
},{timestamps:true})

export const User=mongoose.model("User",userSchema);