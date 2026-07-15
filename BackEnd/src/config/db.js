import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB= async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb Connected");
    } 
    catch(error){
        console.log("MongoDB connection error:",error.message);
        process.exit(1);
    }
}
