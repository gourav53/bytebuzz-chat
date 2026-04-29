@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // ✅ ROOT endpoint (IMPORTANT)
    @GetMapping("/")
    public String home() {
        return "Backend running 🚀";
    }

    // 🔹 CREATE ROOM
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {

        if (room.getRoomId() == null || room.getRoomId().isEmpty()) {
            room.setRoomId(UUID.randomUUID().toString());
        }

        if (roomRepository.findByRoomId(room.getRoomId()) != null) {
            return ResponseEntity.badRequest().body("Room already exists!");
        }

        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    // 🔹 JOIN / GET ROOM
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found!");
        }

        return ResponseEntity.ok(room);
    }
}