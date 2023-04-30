package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Specialite;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Specialite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SpecialiteRepository extends JpaRepository<Specialite, Long> {}
