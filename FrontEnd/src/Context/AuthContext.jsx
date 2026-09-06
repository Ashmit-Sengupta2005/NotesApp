/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext,useContext,useState,useEffect } from "react";
import {api} from "../lib/axios.jsx";
import toast from "react-hot-toast";

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    // holds user id,user name and email or null if logged out
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    // checking if logged in or logged out
    const checkAuth=async()=>{
        try{
        const response=await api.get("/auth/me");
        if(response.data.isAuthenticated){
            setUser(response.data.user);} //active session
        else{
            setUser(null);}} // no active session}
        catch(error){
            console.log("Session Verification failed:");
            console.log(error.message);}
        finally{
            setLoading(false);}};
    // logging in a user
    const login=async(email,password)=>{
        setLoading(true);
        try{
            const response=await api.post("/auth/login",{email,password});
            setUser(response.data.user);
            toast.success(response.data.message||"Logged in Successfully");
            return true;
        }
        catch(error){
            console.log("Error while logging in",error);
            toast.error("Login failed");
            return false;
        }
        finally{
            setLoading(false);
        }
    };

    //Registering a user

    const register=async(username,email,password)=>{
        setLoading(true);
        try{
            const response=await api.post("/auth/register",{username,email,password});
            setUser(response.data.user);
            toast.success("Account created Successfully");
            return true;
        }
        catch(error){
            console.log("Error while registering",error);
            toast.error("Error while registering");
            return false;
        }
        finally{
            setLoading(false);
        }
    }
    // logging out a user
    const logout=async()=>{
        setLoading(true);
        try{
            await api.post("/auth/logout");
            setUser(null);
            toast.success("Logged Out Successfully");
        }
        catch(error){
            console.log("LogOut failed",error);
            toast.error("LogOut failed");
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>
    { checkAuth();},[]);
    return(
        <AuthContext.Provider value={{user,loading,login,register,logout,checkAuth}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth=()=>{
    return useContext(AuthContext);}
