package com.skillswap;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("dev")
@RestController
public class DebugController {

    @GetMapping("/debug")
    public String debug() {
        return "DEBUG OK";
    }
}
