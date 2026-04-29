package com.rachit.bytebuzz.backend.controllers;

import com.rachit.bytebuzz.backend.entities.Room;
import com.rachit.bytebuzz.backend.repositories.RoomRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // ROOT endpoint
    @GetMapping("/")
    public String home() {
        return "Backend running 🚀";
    }

    // CREATE ROOM
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {

        if (room.getRoomId() == null || room.getRoomId().isEmpty()) {
            room.setRoomId(UUID.randomUUID().toString());
        }

        if (roomRepository.findByRoomId(room.getRoomId()) != null) {
            return ResponseEntity
                    .badRequest()
                    .body("Room already exists!");
        }

        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    // GET ROOM
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Room not found!");
        }

        return ResponseEntity.ok(room);
    }
}