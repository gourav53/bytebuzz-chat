package com.rachit.bytebuzz.backend.controllers;

import com.rachit.bytebuzz.backend.entities.Room;
import com.rachit.bytebuzz.backend.repositories.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Create Room
    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        if (room.getRoomId() == null || room.getRoomId().isEmpty()) {
            room.setRoomId(UUID.randomUUID().toString());
        }
        return roomRepository.save(room);
    }

    // Join/Get Room
    @GetMapping("/{roomId}")
    public Room getRoom(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            throw new RuntimeException("Room not found");
        }
        return room;
    }
}
