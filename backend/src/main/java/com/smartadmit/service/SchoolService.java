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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final ApplicationRepository applicationRepository;

    private School getCurrentSchool() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return schoolRepository.findByUser(user).orElseThrow(() -> new RuntimeException("School profile not found"));
    }

    public AppDto.SchoolStats getStats() {
        School school = getCurrentSchool();
        return AppDto.SchoolStats.builder()
                .total(applicationRepository.countBySchool(school))
                .pending(applicationRepository.countBySchoolAndStatus(school, Application.Status.PENDING))
                .approved(applicationRepository.countBySchoolAndStatus(school, Application.Status.APPROVED))
                .rejected(applicationRepository.countBySchoolAndStatus(school, Application.Status.REJECTED))
                .build();
    }

    public AppDto.SchoolResponse getProfile() {
        School s = getCurrentSchool();
        return buildSchoolResponse(s);
    }

    @Transactional
    public AppDto.SchoolResponse updateProfile(AppDto.SchoolProfileRequest req) {
        School school = getCurrentSchool();

        if (req.getName() != null) school.setName(req.getName());
        if (req.getPhone() != null) school.setPhone(req.getPhone());
        if (req.getAddress() != null) school.setAddress(req.getAddress());
        if (req.getCity() != null) school.setCity(req.getCity());
        if (req.getState() != null) school.setState(req.getState());
        if (req.getBoard() != null) school.setBoard(req.getBoard());
        if (req.getEstablished() != null) school.setEstablished(req.getEstablished());
        if (req.getPrincipalName() != null) school.setPrincipalName(req.getPrincipalName());

        if (req.getTotalSeats() != null) {
            int diff = req.getTotalSeats() - (school.getTotalSeats() != null ? school.getTotalSeats() : 0);
            school.setTotalSeats(req.getTotalSeats());
            int newAvail = Math.max(0, (school.getAvailableSeats() != null ? school.getAvailableSeats() : 0) + diff);
            school.setAvailableSeats(newAvail);
        }

        school = schoolRepository.save(school);
        return buildSchoolResponse(school);
    }

    public List<AppDto.ApplicationResponse> getApplications() {
        School school = getCurrentSchool();
        return applicationRepository.findBySchoolOrderByAppliedDateDesc(school)
                .stream().map(a -> AppDto.ApplicationResponse.builder()
                        .id(a.getId())
                        .studentName(a.getStudent().getName())
                        .studentEmail(a.getStudent().getEmail())
                        .studentPhone(a.getStudent().getPhone())
                        .status(a.getStatus().name())
                        .appliedDate(a.getAppliedDate())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public String updateApplicationStatus(Long appId, String action) {
        School school = getCurrentSchool();
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getSchool().getId().equals(school.getId())) {
            throw new RuntimeException("Not authorized");
        }

        if (app.getStatus() != Application.Status.PENDING) {
            throw new RuntimeException("Application already processed");
        }

        if ("approved".equalsIgnoreCase(action)) {
            app.setStatus(Application.Status.APPROVED);
            // Decrease available seats
            if (school.getAvailableSeats() != null && school.getAvailableSeats() > 0) {
                school.setAvailableSeats(school.getAvailableSeats() - 1);
                schoolRepository.save(school);
            }
        } else if ("rejected".equalsIgnoreCase(action)) {
            app.setStatus(Application.Status.REJECTED);
        } else {
            throw new RuntimeException("Invalid action: " + action);
        }

        applicationRepository.save(app);
        return "Application " + action + " successfully";
    }

    private AppDto.SchoolResponse buildSchoolResponse(School s) {
        return AppDto.SchoolResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .email(s.getUser().getEmail())
                .phone(s.getPhone())
                .address(s.getAddress())
                .city(s.getCity())
                .state(s.getState())
                .board(s.getBoard())
                .totalSeats(s.getTotalSeats())
                .availableSeats(s.getAvailableSeats())
                .established(s.getEstablished())
                .principalName(s.getPrincipalName())
                .build();
    }
}
