import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [timer, setTimer] = useState();
  const toast = useToast();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    toast({
      title: "Error!",
      description: "Account Inactive/Blocked. Please Contact Admin",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }

  const debouncer = (cb, delay) => {
    return (...args)=>{
        clearTimeout(timer);
      setTimer(setTimeout(()=> {
        cb(...args);
      },delay));
    };
  } 

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        logout,
        debouncer
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
