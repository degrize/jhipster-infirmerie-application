package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Antecedent;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Antecedent entity.
 */
@Repository
public interface AntecedentRepository extends JpaRepository<Antecedent, Long> {
    default Optional<Antecedent> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Antecedent> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Antecedent> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct antecedent from Antecedent antecedent left join fetch antecedent.patient",
        countQuery = "select count(distinct antecedent) from Antecedent antecedent"
    )
    Page<Antecedent> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct antecedent from Antecedent antecedent left join fetch antecedent.patient")
    List<Antecedent> findAllWithToOneRelationships();

    @Query("select antecedent from Antecedent antecedent left join fetch antecedent.patient where antecedent.id =:id")
    Optional<Antecedent> findOneWithToOneRelationships(@Param("id") Long id);
}
