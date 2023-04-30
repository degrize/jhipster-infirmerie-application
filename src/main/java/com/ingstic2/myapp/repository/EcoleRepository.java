package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Ecole;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Ecole entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EcoleRepository extends JpaRepository<Ecole, Long> {}
