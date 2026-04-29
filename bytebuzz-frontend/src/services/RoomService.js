import { httpClient } from "../config/AxiosHelper";

// ✅ Create Room
export const createRoomApi = async (roomDetail) => {
  const response = await httpClient.post("/api/rooms", roomDetail);
  return response.data;
};

// ✅ Join Room
export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/rooms/${roomId}`);
  return response.data;
};

// ✅ Get Messages
export const getMessagess = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};