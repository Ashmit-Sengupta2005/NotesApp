import mongoose from "mongoose";
//1-> Create a schema 
//2->model based off that schema

const noteSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true},
    content:{
        type:String, 
        required:true},
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }},
    {timestamps:true}); // automatically adds two fields createdAt & updatedAt to the schema

export const Note=mongoose.model("Note",noteSchema);
