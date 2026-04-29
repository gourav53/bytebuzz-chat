async function createRoom() {
  if (validateForm()) {
    try {
      const response = await createRoomApi({
        roomId: detail.roomId,
      });

      toast.success(`Room created successfully`);
      setCurrentUser(detail.userName);
      setRoomId(response.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        toast.error("Room already exists !");
      } else {
        toast("Error creating room");
      }
    }
  }
}