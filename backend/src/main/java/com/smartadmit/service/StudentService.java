package com.smartadmit.service;

import com.smartadmit.dto.AppDto;
import com.smartadmit.model.Application;
import com.smartadmit.model.School;
import com.smartadmit.model.User;
import com.smartadmit.repository.ApplicationRepository;
import com.smartadmit.repository.SchoolRepository;
import com.smartadmit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public AppDto.StudentStats getStats() {
        User student = getCurrentUser();
        long totalSchools = schoolRepository.count();
        long pending = applicationRepository.countByStudentAndStatus(student, Application.Status.PENDING);
        long approved = applicationRepository.countByStudentAndStatus(student, Application.Status.APPROVED);
        long total = applicationRepository.countByStudent(student);
        return AppDto.StudentStats.builder()
                .totalSchools(totalSchools)
                .pending(pending)
                .approved(approved)
                .total(total)
                .build();
    }

    public List<AppDto.ApplicationResponse> getMyApplications() {
        User student = getCurrentUser();
        return applicationRepository.findByStudentOrderByAppliedDateDesc(student)
                .stream().map(a -> AppDto.ApplicationResponse.builder()
                        .id(a.getId())
                        .schoolName(a.getSchool().getName())
                        .status(a.getStatus().name())
                        .appliedDate(a.getAppliedDate())
                        .build())
                .collect(Collectors.toList());
    }

    public List<AppDto.SchoolResponse> getAllSchools() {
        User student = getCurrentUser();
        Set<Long> appliedSchoolIds = applicationRepository
                .findByStudentOrderByAppliedDateDesc(student)
                .stream().map(a -> a.getSchool().getId())
                .collect(Collectors.toSet());

        return schoolRepository.findAll().stream()
                .map(s -> AppDto.SchoolResponse.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .email(s.getUser().getEmail())
                        .phone(s.getPhone())
                        .city(s.getCity())
                        .state(s.getState())
                        .board(s.getBoard())
                        .totalSeats(s.getTotalSeats())
                        .availableSeats(s.getAvailableSeats())
                        .applied(appliedSchoolIds.contains(s.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> updateProfile(Map<String, String> req) {
        User student = getCurrentUser();
        if (req.containsKey("name") && req.get("name") != null && !req.get("name").isBlank()) {
            student.setName(req.get("name"));
        }
        if (req.containsKey("phone")) {
            student.setPhone(req.get("phone"));
        }
        student = userRepository.save(student);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", student.getId());
        result.put("name", student.getName());
        result.put("email", student.getEmail());
        result.put("phone", student.getPhone());
        return result;
    }

    @Transactional
    public String changePassword(Map<String, String> req) {
        User student = getCurrentUser();
        String currentPassword = req.get("currentPassword");
        String newPassword = req.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, student.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }
        student.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(student);
        return "Password changed successfully";
    }

    @Transactional
    public String applyToSchool(AppDto.ApplyRequest req) {
        User student = getCurrentUser();
        School school = schoolRepository.findById(req.getSchoolId())
                .orElseThrow(() -> new RuntimeException("School not found"));

        if (applicationRepository.existsByStudentAndSchool(student, school)) {
            throw new RuntimeException("Already applied to this school");
        }
        if (school.getAvailableSeats() == null || school.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }

        Application application = Application.builder()
                .student(student)
                .school(school)
                .status(Application.Status.PENDING)
                .build();

        applicationRepository.save(application);
        return "Application submitted successfully";
    }
}