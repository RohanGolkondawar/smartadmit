package com.smartadmit.controller;

import com.smartadmit.dto.AppDto;
import com.smartadmit.service.SchoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/school")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(schoolService.getStats());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(schoolService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody AppDto.SchoolProfileRequest req) {
        try {
            return ResponseEntity.ok(schoolService.updateProfile(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications() {
        return ResponseEntity.ok(schoolService.getApplications());
    }

    @PutMapping("/applications/{id}/{action}")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @PathVariable String action) {
        try {
            String msg = schoolService.updateApplicationStatus(id, action);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
