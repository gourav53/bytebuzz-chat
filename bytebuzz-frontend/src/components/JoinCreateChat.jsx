import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Please fill all the fields");
      return false;
    }
    return true;
  }

  // JOIN ROOM
  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined room successfully");

        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);

        navigate("/chat");
      } catch (error) {
        console.log(error);
        toast.error("Room not found");
      }
    }
  }

  // CREATE ROOM (FIXED)
  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi({
          roomId: detail.roomId,
        });

        toast.success("Room created successfully");

        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);

        navigate("/chat");
      } catch (error) {
        console.log(error);
        toast.error("Error creating room");
      }
    }
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Join / Create Room</h2>

      <input
        type="text"
        name="userName"
        placeholder="Enter Name"
        value={detail.userName}
        onChange={handleFormInputChange}
      />
      <br /><br />

      <input
        type="text"
        name="roomId"
        placeholder="Enter Room ID"
        value={detail.roomId}
        onChange={handleFormInputChange}
      />
      <br /><br />

      <button onClick={joinChat}>Join Room</button>
      <br /><br />

      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default JoinCreateChat;