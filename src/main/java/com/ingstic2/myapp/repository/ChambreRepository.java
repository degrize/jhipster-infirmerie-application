package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Chambre;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Chambre entity.
 */
@Repository
public interface ChambreRepository extends JpaRepository<Chambre, Long> {
    default Optional<Chambre> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Chambre> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Chambre> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct chambre from Chambre chambre left join fetch chambre.batiment",
        countQuery = "select count(distinct chambre) from Chambre chambre"
    )
    Page<Chambre> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct chambre from Chambre chambre left join fetch chambre.batiment")
    List<Chambre> findAllWithToOneRelationships();

    @Query("select chambre from Chambre chambre left join fetch chambre.batiment where chambre.id =:id")
    Optional<Chambre> findOneWithToOneRelationships(@Param("id") Long id);
}
