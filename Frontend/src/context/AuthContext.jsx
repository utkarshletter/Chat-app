import { createContext,useContext,useState } from "react";

export const AuthContext=createContext();

export const useAuth=()=>{
    return useContext(AuthContext)
}

export const AuthContextProvider=({children})=>{
    const [AuthUser,setAuthUser]=useState(JSON.parse(localStorage.getItem('chat-app'))||null);
    return (<AuthContext.Provider value={{AuthUser,setAuthUser}}>
        {children}
    </AuthContext.Provider>)
};