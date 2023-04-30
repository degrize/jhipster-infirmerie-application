package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.MiseEnObservation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MiseEnObservation entity.
 */
@Repository
public interface MiseEnObservationRepository extends JpaRepository<MiseEnObservation, Long> {
    default Optional<MiseEnObservation> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<MiseEnObservation> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<MiseEnObservation> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct miseEnObservation from MiseEnObservation miseEnObservation left join fetch miseEnObservation.miseEnObservation",
        countQuery = "select count(distinct miseEnObservation) from MiseEnObservation miseEnObservation"
    )
    Page<MiseEnObservation> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct miseEnObservation from MiseEnObservation miseEnObservation left join fetch miseEnObservation.miseEnObservation")
    List<MiseEnObservation> findAllWithToOneRelationships();

    @Query(
        "select miseEnObservation from MiseEnObservation miseEnObservation left join fetch miseEnObservation.miseEnObservation where miseEnObservation.id =:id"
    )
    Optional<MiseEnObservation> findOneWithToOneRelationships(@Param("id") Long id);
}
