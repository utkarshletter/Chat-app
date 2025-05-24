import React from "react";
import { Outlet,Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const VerifyUser=()=>{
    const {AuthUser}=useAuth();
    return AuthUser?<Outlet/>:<Navigate to='/login'/>
}