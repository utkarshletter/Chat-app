import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from './components/Sidebar.jsx';
import { MessageContainer } from './components/MessageContainer';

export const Home = () => {
    const {AuthUser}=useAuth();
  return (
    <div className="flex flex-col justify-between w-full
    md:w-[550px] max-w-[65%] p-4
    rounded-2xl shadow-2xl border border-white/30
    bg-white/10 backdrop-blur-md backdrop-saturate-150
    bg-clip-padding text-white
    transition-all duration-300
    ">
        <div>
            <Sidebar/>
        </div>
        <div>
            <MessageContainer/>
        </div>
    </div>

  )
}
