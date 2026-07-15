export const isAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next(); // User is logged in / session-id is valid
    }
    return res.status (401).json({message:"Unauthorized.Please log in or sign up first"});
}
