package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Personnel;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Personnel entity.
 */
@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Long> {
    default Optional<Personnel> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Personnel> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Personnel> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct personnel from Personnel personnel left join fetch personnel.patient left join fetch personnel.service",
        countQuery = "select count(distinct personnel) from Personnel personnel"
    )
    Page<Personnel> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct personnel from Personnel personnel left join fetch personnel.patient left join fetch personnel.service")
    List<Personnel> findAllWithToOneRelationships();

    @Query(
        "select personnel from Personnel personnel left join fetch personnel.patient left join fetch personnel.service where personnel.id =:id"
    )
    Optional<Personnel> findOneWithToOneRelationships(@Param("id") Long id);
}
