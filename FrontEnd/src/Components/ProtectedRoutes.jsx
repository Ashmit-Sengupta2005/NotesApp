import { useAuth } from "../Context/AuthContext.jsx";
import { Navigate } from "react-router";
import Loading from "./Loading.jsx";
const ProtectedRoutes=({children})=>{
    const {user,loading}=useAuth();
    if(loading){
        if (user) {
            return <Loading message="Signing out..." description="Clearing your session securely..." />;
        }
        return <Loading message="Verifying session..." description="Checking credentials, please wait..." />;
    }
    if(!user){
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default ProtectedRoutes;