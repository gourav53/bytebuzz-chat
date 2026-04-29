package backend.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/test")
    public String test() {
        return "Backend chal raha hai 🚀";
    }
}