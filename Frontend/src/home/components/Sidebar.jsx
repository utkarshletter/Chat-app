import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { BiLogOut } from "react-icons/bi";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import userConversation from "../../zustand/userConversation";
import { useSocketContext } from "../../context/socketContext";

export const Sidebar = ({ onSelectUser }) => {
  const { AuthUser, setAuthUser } = useAuth();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers,setNewMessageUsers]=useState('');
  const { messages,
    selectedConversation,
    setMessages,
    setSelectedConversation, } =
    userConversation();
  const { onlineUser, socket } = useSocketContext();
  
  const nowOnline = chatUser.map((user) => user._id);
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));


    useEffect(()=>{
      socket?.on("newMessage",(newMessage)=>{
          setNewMessageUsers(newMessage)
      })
  
      return ()=>socket?.off("newMessage");
    },[socket,messages])

  useEffect(() => {
    if (!AuthUser) return;

    const chatUserHandler = async () => {
      setLoading(true);
      try {
        // Send cookies with this request
        const chatters = await axios.get("/api/user/getcurrentchatters", {
          withCredentials: true,
        });
        const data = chatters.data;

        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
          return;
        }

        setChatUser(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    chatUserHandler();
  }, [AuthUser]);
  console.log(chatUser);

  //show user from search result
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;

      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
        return;
      }

      setLoading(false);

      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  console.log(searchUser);

  //konsa user selected hai
  const handelUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers('')
  };

  // logout
  const handelLogOut = async () => {
    const confirmlogout = window.prompt("Type Your 'UserName' To LOGOUT");
    if (confirmlogout === AuthUser.username) {
      setLoading(true);
      try {
        const token =
          AuthUser?.token ||
          JSON.parse(localStorage.getItem("chat-app"))?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const logout = await axios.post("/api/auth/logout", {}, config);
        const data = logout.data;

        if (data?.success === false) {
          setLoading(false);
          console.log(data?.message);
          return;
        }

        toast.info(data?.message);
        localStorage.removeItem("chat-app"); // fixed key here
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("LogOut Cancelled");
    }
  };
  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  return (
    <div
      className="h-screen md:h-full w-full overflow-hidden p-4 
  bg-white/10 backdrop-blur-md border-r border-white/20 rounded-l-2xl"
    >
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handleSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full text-black"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="px-4 w-auto bg-transparent outline-none rounded-full"
            placeholder="Search User"
          />
          <button
            type="submit"
            className="btn btn-circle bg-sky-700 hover:bg-gray-950"
          >
            <FaSearch />
          </button>
        </form>
        <img
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer"
          onClick={() => navigate(`/profile/${AuthUser?._id}`)}
          src={AuthUser?.profilepic}
          alt="Profile"
        />
      </div>
      <div className="divider px-3"></div>
      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handelUserClick(user)}
                    className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                ${
                                  selectedUserId === user?._id
                                    ? "bg-sky-500"
                                    : ""
                                } `}
                  >
                    <div className="avatar relative w-12 h-12">
                      <img
                        src={user.profilepic}
                        alt="user.img"
                        className="w-12 h-12 rounded-full"
                      />
                      {isOnline[index] && (
                        <span className="indicator-item badge badge-success badge-xs absolute bottom-1 right-1"></span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-grey-950">{user.username}</p>
                    </div>
                  </div>
                  <div className="divider divide-solid px-3 h-[1px]"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handleSearchBack}
              className="bg-white hover:bg-gray-200 transition rounded-full px-2 py-1 self-center shadow cursor-pointer"
            >
              <IoArrowBackSharp size={25} className="text-black" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>Why are you Alone!!🤔</h1>
                    <h1>Search username to chat</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handelUserClick(user)}
                        className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                ${
                                  selectedUserId === user?._id
                                    ? "bg-sky-500"
                                    : ""
                                } `}
                      >
                        <div className="avatar relative w-12 h-12">
                          <img
                            src={user.profilepic}
                            alt="user.img"
                            className="w-12 h-12 rounded-full"
                          />
                          {isOnline[index] && (
                            <span className="indicator-item badge badge-success badge-xs absolute bottom-1 right-1"></span>
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="font-bold text-grey-950">
                            {user.username}
                          </p>
                        </div>
                        <div>
                          {newMessageUsers.receiverId === AuthUser._id &&
                          newMessageUsers.senderId === user._id ? (
                            <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                              +1
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className="divider divide-solid px-3 h-[1px]"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handelLogOut}
              className="hover:bg-red-600  w-10 cursor-pointer hover:text-white rounded-lg"
            >
              <BiLogOut size={25} />
            </button>
            <p className="text-sm py-1">Logout</p>
          </div>
        </>
      )}
    </div>
  );
};
