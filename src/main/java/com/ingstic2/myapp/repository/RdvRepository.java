package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Rdv;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Rdv entity.
 */
@Repository
public interface RdvRepository extends JpaRepository<Rdv, Long> {
    default Optional<Rdv> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Rdv> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Rdv> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct rdv from Rdv rdv left join fetch rdv.consultation",
        countQuery = "select count(distinct rdv) from Rdv rdv"
    )
    Page<Rdv> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct rdv from Rdv rdv left join fetch rdv.consultation")
    List<Rdv> findAllWithToOneRelationships();

    @Query("select rdv from Rdv rdv left join fetch rdv.consultation where rdv.id =:id")
    Optional<Rdv> findOneWithToOneRelationships(@Param("id") Long id);
}
