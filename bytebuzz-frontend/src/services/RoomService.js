import { httpClient } from "../config/AxiosHelper";

// CREATE ROOM
export const createRoomApi = async (roomId) => {
  const response = await httpClient.post("/api/v1/rooms", {
    roomId: roomId,
  });
  return response.data;
};

// JOIN ROOM
export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

// GET MESSAGES
export const getMessages = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};