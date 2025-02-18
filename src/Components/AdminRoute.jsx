import { Navigate, Outlet } from "react-router-dom";


const AdminRoute = () =>{
    const token= localStorage.getItem("Token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    return  token && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;

