package com.smartadmit.service;

import com.smartadmit.dto.AppDto;
import com.smartadmit.model.Application;
import com.smartadmit.model.School;
import com.smartadmit.model.User;
import com.smartadmit.repository.ApplicationRepository;
import com.smartadmit.repository.SchoolRepository;
import com.smartadmit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public AppDto.AdminStats getStats() {
        return AppDto.AdminStats.builder()
                .totalSchools(schoolRepository.count())
                .totalStudents(userRepository.findByRole(User.Role.STUDENT).size())
                .totalApplications(applicationRepository.count())
                .pendingApplications(applicationRepository.countByStatus(Application.Status.PENDING))
                .build();
    }

    public List<AppDto.SchoolResponse> getAllSchools() {
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
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public AppDto.SchoolResponse createSchool(AppDto.CreateSchoolRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.SCHOOL)
                .build();
        user = userRepository.save(user);

        int seats = req.getTotalSeats() != null ? req.getTotalSeats() : 100;
        School school = School.builder()
                .user(user)
                .name(req.getName())
                .phone(req.getPhone())
                .city(req.getCity())
                .state(req.getState())
                .board(req.getBoard())
                .totalSeats(seats)
                .availableSeats(seats)
                .build();
        school = schoolRepository.save(school);

        return AppDto.SchoolResponse.builder()
                .id(school.getId())
                .name(school.getName())
                .email(user.getEmail())
                .city(school.getCity())
                .state(school.getState())
                .board(school.getBoard())
                .totalSeats(school.getTotalSeats())
                .availableSeats(school.getAvailableSeats())
                .build();
    }

    @Transactional
    public void deleteSchool(Long id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found"));
        // Delete all applications for this school first
        List<Application> apps = applicationRepository.findBySchoolOrderByAppliedDateDesc(school);
        applicationRepository.deleteAll(apps);
        User user = school.getUser();
        schoolRepository.delete(school);
        userRepository.delete(user);
    }

    public List<Map<String, Object>> getAllStudents() {
        return userRepository.findByRole(User.Role.STUDENT).stream()
                .map(u -> {
                    Map<String, Object> student = new java.util.LinkedHashMap<>();
                    student.put("id", u.getId());
                    student.put("name", u.getName());
                    student.put("email", u.getEmail());
                    student.put("phone", u.getPhone());
                    student.put("createdAt", u.getCreatedAt());
                    return student;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createStudent(AppDto.CreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("phone", user.getPhone());
        result.put("createdAt", user.getCreatedAt());
        return result;
    }

    @Transactional
    public void deleteStudent(Long id) {
        User student = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        if (student.getRole() != User.Role.STUDENT) throw new RuntimeException("User is not a student");
        List<Application> apps = applicationRepository.findByStudentOrderByAppliedDateDesc(student);
        applicationRepository.deleteAll(apps);
        userRepository.delete(student);
    }
}