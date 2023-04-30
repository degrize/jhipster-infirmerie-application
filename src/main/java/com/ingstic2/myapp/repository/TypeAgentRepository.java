package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.TypeAgent;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TypeAgent entity.
 */
@Repository
public interface TypeAgentRepository extends JpaRepository<TypeAgent, Long> {
    default Optional<TypeAgent> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TypeAgent> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TypeAgent> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct typeAgent from TypeAgent typeAgent left join fetch typeAgent.agentSante",
        countQuery = "select count(distinct typeAgent) from TypeAgent typeAgent"
    )
    Page<TypeAgent> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct typeAgent from TypeAgent typeAgent left join fetch typeAgent.agentSante")
    List<TypeAgent> findAllWithToOneRelationships();

    @Query("select typeAgent from TypeAgent typeAgent left join fetch typeAgent.agentSante where typeAgent.id =:id")
    Optional<TypeAgent> findOneWithToOneRelationships(@Param("id") Long id);
}
