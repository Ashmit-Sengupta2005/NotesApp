import { useAuth } from "../Context/AuthContext.jsx";
import { Navigate } from "react-router";
import Loading from "./Loading.jsx";
const ProtectedRoutes=({children})=>{
    const {user,loading}=useAuth();
    if(loading){
        return <Loading/>;
    }
    if(!user){
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default ProtectedRoutes;