import React, { useEffect, useRef, useState } from "react";
import userConversation from "../../zustand/userConversation";
import { useAuth } from "../../context/AuthContext";
import { TiArrowBack, TiMessages } from "react-icons/ti";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/socketContext";

export const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    selectedConversation,
    setMessages,
    setSelectedConversation,
  } = userConversation();
  const {socket}=useSocketContext();
  const { AuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(()=>{
    socket?.on("newMessage",(newMessage)=>{
        setMessages([...messages,newMessage])
    })

    return ()=>socket?.off("newMessage");
  },[socket,setMessages,messages])

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);
  console.log(messages);
  const handleMessage = (e) => {
    setSendData(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSendData("");
      setMessages([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };
  return (
    <div className="h-[98%] md:h-[100%] flex flex-col justify-center pt-0 pb-2 mt-[5%]">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="px-4 text-center text-2xl text-gray-950 font-semibold 
            flex flex-col items-center gap-2"
          >
            <p className="text-2xl">Welcome!!👋 {AuthUser.username}😉</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="md:hidden ml-1 self-center">
                <button
                  onClick={() => {
                    onBackUser(true);
                  }}
                  className="bg-white rounded-full px-2 py-1 self-center"
                >
                  <TiArrowBack size={25} />
                </button>
              </div>
              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center">
                  <img
                    className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                    src={selectedConversation?.profilepic}
                  />
                </div>
                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                <div className="loading loading-spinner"></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className="text-center text-white items-center">
                Send a message to start Conversation
              </p>
            )}
            {!loading &&
              messages?.length > 0 &&
              messages.map((message) => (
                <div
                  className="text-white"
                  key={message?._id}
                  ref={lastMessageRef}
                >
                  <div
                    className={`chat ${
                      message.senderId === AuthUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar"></div>
                    <div
                      className={`chat-bubble text-black ${
                        message.senderId === AuthUser._id
                          ? "bg-sky-600 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {message?.message}
                    </div>
                    <div className="chat-footer text-[10px] opacity-80 text-white">
                      {new Date(message?.createdAt).toLocaleDateString("en-IN")}
                      {new Date(message?.createdAt).toLocaleTimeString(
                        "en-IN",
                        { hour: "numeric", minute: "numeric" }
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <form onSubmit={handleSubmit} className="rounded-full text-black">
            <div className="w-full rounded-full flex items-center bg-white">
              <input
                value={sendData}
                onChange={handleMessage}
                required
                id="message"
                type="text"
                className="w-full bg-transparent outline-none px-4 rounded-full"
              />
              <button type="submit">
                {sending ? (
                  <div className="loading loading-spinner"></div>
                ) : (
                  <IoSend
                    size={25}
                    className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
