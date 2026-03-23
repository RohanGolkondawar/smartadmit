package com.smartadmit.dto;

import lombok.*;

import java.time.LocalDateTime;

public class AppDto {

    // ── School DTOs ──────────────────────────────────────────────
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SchoolResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String board;
        private Integer totalSeats;
        private Integer availableSeats;
        private Integer established;
        private String principalName;
        private boolean applied; // for student context
    }

    @Data
    public static class SchoolProfileRequest {
        private String name;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String board;
        private Integer totalSeats;
        private Integer established;
        private String principalName;
    }

    // ── Application DTOs ─────────────────────────────────────────
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ApplicationResponse {
        private Long id;
        private String schoolName;
        private String studentName;
        private String studentEmail;
        private String studentPhone;
        private String status;
        private LocalDateTime appliedDate;
    }

    @Data
    public static class ApplyRequest {
        private Long schoolId;
    }

    // ── Stats DTOs ───────────────────────────────────────────────
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StudentStats {
        private long totalSchools;
        private long pending;
        private long approved;
        private long total;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SchoolStats {
        private long total;
        private long pending;
        private long approved;
        private long rejected;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AdminStats {
        private long totalSchools;
        private long totalStudents;
        private long totalApplications;
        private long pendingApplications;
    }

    // ── Admin Create School ──────────────────────────────────────
    @Data
    public static class CreateSchoolRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String city;
        private String state;
        private String board;
        private Integer totalSeats;
    }

    // ── Admin Create Student ─────────────────────────────────────
    @Data
    public static class CreateUserRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
    }
}
