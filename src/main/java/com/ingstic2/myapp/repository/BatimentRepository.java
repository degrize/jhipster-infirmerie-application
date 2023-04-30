package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Batiment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Batiment entity.
 */
@Repository
public interface BatimentRepository extends JpaRepository<Batiment, Long> {
    default Optional<Batiment> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Batiment> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Batiment> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct batiment from Batiment batiment left join fetch batiment.site",
        countQuery = "select count(distinct batiment) from Batiment batiment"
    )
    Page<Batiment> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct batiment from Batiment batiment left join fetch batiment.site")
    List<Batiment> findAllWithToOneRelationships();

    @Query("select batiment from Batiment batiment left join fetch batiment.site where batiment.id =:id")
    Optional<Batiment> findOneWithToOneRelationships(@Param("id") Long id);
}
