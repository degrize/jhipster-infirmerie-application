package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Pathologie;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Pathologie entity.
 *
 * When extending this class, extend PathologieRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface PathologieRepository extends PathologieRepositoryWithBagRelationships, JpaRepository<Pathologie, Long> {
    default Optional<Pathologie> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Pathologie> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Pathologie> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct pathologie from Pathologie pathologie left join fetch pathologie.typePathologie",
        countQuery = "select count(distinct pathologie) from Pathologie pathologie"
    )
    Page<Pathologie> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct pathologie from Pathologie pathologie left join fetch pathologie.typePathologie")
    List<Pathologie> findAllWithToOneRelationships();

    @Query("select pathologie from Pathologie pathologie left join fetch pathologie.typePathologie where pathologie.id =:id")
    Optional<Pathologie> findOneWithToOneRelationships(@Param("id") Long id);
}
