package com.smartadmit.repository;

import com.smartadmit.model.Application;
import com.smartadmit.model.School;
import com.smartadmit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentOrderByAppliedDateDesc(User student);
    List<Application> findBySchoolOrderByAppliedDateDesc(School school);
    boolean existsByStudentAndSchool(User student, School school);
    long countByStatus(Application.Status status);
    long countBySchoolAndStatus(School school, Application.Status status);
    long countBySchool(School school);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.student = :student AND a.status = :status")
    long countByStudentAndStatus(User student, Application.Status status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.student = :student")
    long countByStudent(User student);
}
