package com.smartadmit.controller;

import com.smartadmit.dto.AppDto;
import com.smartadmit.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ── Schools ──────────────────────────────────────────────────────
    @GetMapping("/schools")
    public ResponseEntity<?> getAllSchools() {
        return ResponseEntity.ok(adminService.getAllSchools());
    }

    @PostMapping("/schools")
    public ResponseEntity<?> createSchool(@RequestBody AppDto.CreateSchoolRequest req) {
        try {
            return ResponseEntity.ok(adminService.createSchool(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/schools/{id}")
    public ResponseEntity<?> deleteSchool(@PathVariable Long id) {
        try {
            adminService.deleteSchool(id);
            return ResponseEntity.ok(Map.of("message", "School deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Students ─────────────────────────────────────────────────────
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@RequestBody AppDto.CreateUserRequest req) {
        try {
            return ResponseEntity.ok(adminService.createStudent(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            adminService.deleteStudent(id);
            return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}