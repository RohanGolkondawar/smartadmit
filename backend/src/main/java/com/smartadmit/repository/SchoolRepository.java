package com.smartadmit.repository;

import com.smartadmit.model.School;
import com.smartadmit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Long> {
    Optional<School> findByUser(User user);
    Optional<School> findByUserId(Long userId);
}
