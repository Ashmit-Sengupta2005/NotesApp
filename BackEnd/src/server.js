import express from "express";
import notesRoutes from "./Routes/notesRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import {connectDB}  from "./config/db.js";
import dotenv from "dotenv";
import { rateLimiter } from "./MiddleWare/RateLimiter.js";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./config/passport.js";
dotenv.config();
//console.log(process.env.MONGO_URL);
const app = express();
app.set("trust proxy",1);
app.use(cors({
    origin: process.env.FRONTEND_URL||"http://localhost:5174",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],}));
app.use(express.json());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URL,
        collectionName:"sessions"}),
    cookie:{
        maxAge:100*60*60*24,
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production"?"none":"lax"
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimiter);
const port=process.env.PORT;
app.use("/api/notes", notesRoutes);
app.use("/api/auth",authRoutes);
connectDB().catch((error)=>{
    console.log("MongoDB Connection Error:",error.message);
    process.exit(1);
});
if(process.env.NODE_ENV!=="production"){
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
}

export default app;