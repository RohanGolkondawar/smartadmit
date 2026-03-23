package com.smartadmit.controller;

import com.smartadmit.dto.AppDto;
import com.smartadmit.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(studentService.getStats());
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications() {
        return ResponseEntity.ok(studentService.getMyApplications());
    }

    @GetMapping("/schools")
    public ResponseEntity<?> getAllSchools() {
        return ResponseEntity.ok(studentService.getAllSchools());
    }

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody AppDto.ApplyRequest req) {
        try {
            String msg = studentService.applyToSchool(req);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Profile endpoints ─────────────────────────────────────────────

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> req) {
        try {
            return ResponseEntity.ok(studentService.updateProfile(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> req) {
        try {
            String msg = studentService.changePassword(req);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}