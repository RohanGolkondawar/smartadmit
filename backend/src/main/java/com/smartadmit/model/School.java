package com.smartadmit.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "schools")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String board;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "available_seats")
    private Integer availableSeats;

    private Integer established;

    @Column(name = "principal_name")
    private String principalName;

    @PrePersist
    protected void onCreate() {
        if (availableSeats == null && totalSeats != null) {
            availableSeats = totalSeats;
        }
    }
}
