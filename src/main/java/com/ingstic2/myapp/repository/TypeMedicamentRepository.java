package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.TypeMedicament;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TypeMedicament entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeMedicamentRepository extends JpaRepository<TypeMedicament, Long> {}
