package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.TypePathologie;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TypePathologie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypePathologieRepository extends JpaRepository<TypePathologie, Long> {}
