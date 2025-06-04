import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { MessageContainer } from "./components/MessageContainer";
import userConversation from "../zustand/userConversation";

export const Home = () => {
  const { setSelectedConversation } = userConversation();
  const { AuthUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    setSelectedUser(null);
    setSelectedConversation(null);
    setIsSidebarVisible(true);
  }, [AuthUser, setSelectedConversation]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center px-2 md:px-4 overflow-hidden">
      <div className="flex w-full h-[85vh] max-w-[1300px] rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            h-full
            w-full md:w-[30%] min-w-[250px] border-r border-white/10
            ${isSidebarVisible ? "block" : "hidden"} md:block
          `}
        >
          <Sidebar onSelectUser={handleUserSelect} />
        </div>

        {/* Message Container */}
        <div
          className={`
            flex-1 h-full
            bg-emerald-300/10 backdrop-blur-2xl border-l border-emerald-100/20
            shadow-inner rounded-l-2xl
            ${isSidebarVisible ? "hidden" : "block"} md:block
          `}
        >
          <MessageContainer onBackUser={handleShowSidebar} selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
};
