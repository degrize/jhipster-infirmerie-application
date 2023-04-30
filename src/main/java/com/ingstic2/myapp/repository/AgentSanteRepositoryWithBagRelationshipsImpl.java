package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.AgentSante;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class AgentSanteRepositoryWithBagRelationshipsImpl implements AgentSanteRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<AgentSante> fetchBagRelationships(Optional<AgentSante> agentSante) {
        return agentSante.map(this::fetchSpecialites);
    }

    @Override
    public Page<AgentSante> fetchBagRelationships(Page<AgentSante> agentSantes) {
        return new PageImpl<>(fetchBagRelationships(agentSantes.getContent()), agentSantes.getPageable(), agentSantes.getTotalElements());
    }

    @Override
    public List<AgentSante> fetchBagRelationships(List<AgentSante> agentSantes) {
        return Optional.of(agentSantes).map(this::fetchSpecialites).orElse(Collections.emptyList());
    }

    AgentSante fetchSpecialites(AgentSante result) {
        return entityManager
            .createQuery(
                "select agentSante from AgentSante agentSante left join fetch agentSante.specialites where agentSante is :agentSante",
                AgentSante.class
            )
            .setParameter("agentSante", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<AgentSante> fetchSpecialites(List<AgentSante> agentSantes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, agentSantes.size()).forEach(index -> order.put(agentSantes.get(index).getId(), index));
        List<AgentSante> result = entityManager
            .createQuery(
                "select distinct agentSante from AgentSante agentSante left join fetch agentSante.specialites where agentSante in :agentSantes",
                AgentSante.class
            )
            .setParameter("agentSantes", agentSantes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
