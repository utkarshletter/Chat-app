import React, { useState ,useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { MessageContainer } from "./components/MessageContainer";
import userConversation from "../zustand/userConversation";
export const Home = () => {
    const { setSelectedConversation } = userConversation();
  const { AuthUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

//to reset selected user on changing users(log out & log in)
  useEffect(() => {
    setSelectedUser(null);
    setSelectedConversation(null);
    setIsSidebarVisible(true);
  }, [AuthUser, setSelectedConversation]);
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false); // Hide sidebar on small screens when a user is selected
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="flex w-full h-full items-stretch justify-center px-2 md:px-4 py-4">
      <div
        className="
          flex flex-col md:flex-row flex-1 max-w-[1300px] rounded-2xl shadow-2xl
          bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden
        "
      >
        {/* Sidebar */}
        <div
          className={`
            w-full md:w-[30%] min-w-[250px] border-r border-white/10
            ${isSidebarVisible ? "block" : "hidden"} md:block
          `}
        >
          <Sidebar onSelectUser={handleUserSelect} />
        </div>

        {/* Message Container */}
        <div
          className={`
            flex-1
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
