package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.CentreSante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CentreSante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CentreSanteRepository extends JpaRepository<CentreSante, Long> {}
