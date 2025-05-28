import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { AuthUser } = useAuth();

  useEffect(() => {
    let newSocket;

    if (AuthUser) {
      newSocket = io("https://uv-chatters.onrender.com", {
        query: {
          userId: AuthUser._id,
        },
        transports: ["websocket"],
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) newSocket.disconnect();
      setSocket(null);
    };
  }, [AuthUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
