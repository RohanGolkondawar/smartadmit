package com.smartadmit.config;

import com.smartadmit.model.School;
import com.smartadmit.model.User;
import com.smartadmit.repository.SchoolRepository;
import com.smartadmit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedDemoStudent();
        seedDemoSchools();
        log.info("✅ SmartAdmit data seeding complete.");
    }

    private void seedAdmin() {
        if (userRepository.findByEmail("admin@smartadmit.com").isEmpty()) {
            User admin = User.builder()
                    .name("Super Admin")
                    .email("admin@smartadmit.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9000000000")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Admin seeded: admin@smartadmit.com / admin123");
        }

        // Demo admin
        if (userRepository.findByEmail("admin@demo.com").isEmpty()) {
            User admin = User.builder()
                    .name("Demo Admin")
                    .email("admin@demo.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("9000000001")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Demo admin seeded: admin@demo.com / password123");
        }
    }

    private void seedDemoStudent() {
        if (userRepository.findByEmail("student@demo.com").isEmpty()) {
            User student = User.builder()
                    .name("Rahul Sharma")
                    .email("student@demo.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("9876543210")
                    .role(User.Role.STUDENT)
                    .build();
            userRepository.save(student);
            log.info("Demo student seeded: student@demo.com / password123");
        }
    }

    private void seedDemoSchools() {
        // Demo school user for login page
        if (userRepository.findByEmail("school@demo.com").isEmpty()) {
            User schoolUser = User.builder()
                    .name("Delhi Public School")
                    .email("school@demo.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("9111111111")
                    .role(User.Role.SCHOOL)
                    .build();
            schoolUser = userRepository.save(schoolUser);

            School school = School.builder()
                    .user(schoolUser)
                    .name("Delhi Public School")
                    .phone("9111111111")
                    .address("Sector 45, RK Puram")
                    .city("New Delhi")
                    .state("Delhi")
                    .board("CBSE")
                    .totalSeats(200)
                    .availableSeats(200)
                    .established(1985)
                    .principalName("Dr. Anita Verma")
                    .build();
            schoolRepository.save(school);
            log.info("Demo school seeded: school@demo.com / password123");
        }

        // Extra schools for students to apply to
        String[][] schools = {
            {"Kendriya Vidyalaya No.1", "kv1@school.com", "9122222222", "Sector 1", "Mumbai", "Maharashtra", "CBSE", "150"},
            {"St. Xavier's High School", "stxaviers@school.com", "9133333333", "Park Street", "Kolkata", "West Bengal", "ICSE", "120"},
            {"Presidency School", "presidency@school.com", "9144444444", "MG Road", "Bengaluru", "Karnataka", "State", "180"},
            {"The Cathedral School", "cathedral@school.com", "9155555555", "Civil Lines", "Chennai", "Tamil Nadu", "ICSE", "100"},
            {"Modern School", "modern@school.com", "9166666666", "Barakhamba Road", "New Delhi", "Delhi", "CBSE", "250"},
        };

        for (String[] s : schools) {
            if (userRepository.findByEmail(s[1]).isEmpty()) {
                User u = User.builder()
                        .name(s[0]).email(s[1]).password(passwordEncoder.encode("school123"))
                        .phone(s[2]).role(User.Role.SCHOOL).build();
                u = userRepository.save(u);

                int seats = Integer.parseInt(s[7]);
                School sc = School.builder()
                        .user(u).name(s[0]).phone(s[2]).address(s[3])
                        .city(s[4]).state(s[5]).board(s[6])
                        .totalSeats(seats).availableSeats(seats)
                        .established(1990).principalName("Principal " + s[0])
                        .build();
                schoolRepository.save(sc);
                log.info("School seeded: {}", s[0]);
            }
        }
    }
}
