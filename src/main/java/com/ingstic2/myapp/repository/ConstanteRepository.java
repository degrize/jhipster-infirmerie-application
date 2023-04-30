package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Constante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Constante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConstanteRepository extends JpaRepository<Constante, Long> {}
