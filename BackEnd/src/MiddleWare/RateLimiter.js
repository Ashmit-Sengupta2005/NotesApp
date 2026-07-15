import { ratelimit } from "../config/upstash.js";
export const rateLimiter=async (req,res,next)=>{
    try{
        const {success}=await ratelimit.limit(req.ip);
        if(success) next();
        else return res.status(429).json({message:"Too many requests. Try again later."});
    }
    catch(error){
        console.log("Rate Limit error:",error.message);
        next(error);
    }
}