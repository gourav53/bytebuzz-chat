import React, { useEffect, useRef, useState } from "react";
import { MdSend, MdExitToApp } from "react-icons/md";
import { FiUser, FiHash } from "react-icons/fi";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config/AxiosHelper";
import toast from "react-hot-toast";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);

  // ✅ Avatar helpers
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // redirect
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected]);

  // auto scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // websocket
  useEffect(() => {
    if (!connected || !roomId) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(() => sock);

    client.connect({}, () => {
      stompClientRef.current = client;
      toast.success("Connected");

      client.subscribe(`/topic/room/${roomId}`, (msg) => {
        const newMsg = JSON.parse(msg.body);
        setMessages((prev) => [...prev, newMsg]);
      });
    });

    return () => {
      stompClientRef.current?.disconnect();
    };
  }, [roomId, connected]);

  // send
  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      sender: currentUser,
      content: input,
      roomId,
    };

    stompClientRef.current?.send(
      `/app/sendMessage/${roomId}`,
      {},
      JSON.stringify(message)
    );

    setInput("");
  };

  // logout
  const handleLogout = () => {
    stompClientRef.current?.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      {/* HEADER */}
      <div className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <FiHash />
          <span className="font-semibold">{roomId}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiUser />
          <span className="font-semibold">{currentUser}</span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          <MdExitToApp />
        </button>
      </div>

      {/* CHAT */}
      <div
        ref={chatBoxRef}
        className="pt-20 pb-24 px-4 max-w-3xl mx-auto h-screen overflow-y-auto"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-4 ${
              msg.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-2 p-3 rounded-xl max-w-xs break-words shadow ${
                msg.sender === currentUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
              }`}
            >
              {/* AVATAR */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${getColor(
                  msg.sender || "User"
                )}`}
              >
                {getInitial(msg.sender || "User")}
              </div>

              {/* MESSAGE */}
              <div>
                <p className="font-bold text-sm">{msg.sender || "User"}</p>

                <p className="text-sm break-words">
                  {msg.content || "..."}
                </p>

                <p className="text-xs opacity-70 mt-1">
                  {msg.timeStamp
                    ? new Date(msg.timeStamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Kolkata",
                      })
                    : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="fixed bottom-4 w-full px-4">
        <div className="flex bg-white dark:bg-gray-800 p-2 rounded-full shadow max-w-xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-3 bg-transparent outline-none text-black dark:text-white"
            placeholder="Type message..."
          />

          <button onClick={sendMessage} className="text-blue-500 px-2">
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;