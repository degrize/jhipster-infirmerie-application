package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.TypeConsultation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TypeConsultation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeConsultationRepository extends JpaRepository<TypeConsultation, Long> {}
