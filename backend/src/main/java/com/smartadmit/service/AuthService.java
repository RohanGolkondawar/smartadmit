package com.smartadmit.service;

import com.smartadmit.dto.AuthDto;
import com.smartadmit.model.School;
import com.smartadmit.model.User;
import com.smartadmit.repository.SchoolRepository;
import com.smartadmit.repository.UserRepository;
import com.smartadmit.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public String register(AuthDto.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(req.getRole().toUpperCase());
            if (role == User.Role.ADMIN) throw new RuntimeException("Cannot self-register as ADMIN");
        } catch (IllegalArgumentException e) {
            role = User.Role.STUDENT;
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(role)
                .build();

        user = userRepository.save(user);

        // If SCHOOL role, create school profile
        if (role == User.Role.SCHOOL) {
            School school = School.builder()
                    .user(user)
                    .name(req.getName())
                    .phone(req.getPhone())
                    .totalSeats(100)
                    .availableSeats(100)
                    .build();
            schoolRepository.save(school);
        }

        return "User registered successfully";
    }

    public AuthDto.LoginResponse login(AuthDto.LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthDto.LoginResponse.builder()
                .token(token)
                .user(AuthDto.UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}
