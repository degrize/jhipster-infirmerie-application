package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Medicament;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Medicament entity.
 */
@Repository
public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    default Optional<Medicament> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Medicament> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Medicament> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct medicament from Medicament medicament left join fetch medicament.typeMedicament left join fetch medicament.ordonnance",
        countQuery = "select count(distinct medicament) from Medicament medicament"
    )
    Page<Medicament> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct medicament from Medicament medicament left join fetch medicament.typeMedicament left join fetch medicament.ordonnance"
    )
    List<Medicament> findAllWithToOneRelationships();

    @Query(
        "select medicament from Medicament medicament left join fetch medicament.typeMedicament left join fetch medicament.ordonnance where medicament.id =:id"
    )
    Optional<Medicament> findOneWithToOneRelationships(@Param("id") Long id);
}
