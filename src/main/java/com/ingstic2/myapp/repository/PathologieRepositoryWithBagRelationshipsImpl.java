package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Pathologie;
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
public class PathologieRepositoryWithBagRelationshipsImpl implements PathologieRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Pathologie> fetchBagRelationships(Optional<Pathologie> pathologie) {
        return pathologie.map(this::fetchConsultations);
    }

    @Override
    public Page<Pathologie> fetchBagRelationships(Page<Pathologie> pathologies) {
        return new PageImpl<>(fetchBagRelationships(pathologies.getContent()), pathologies.getPageable(), pathologies.getTotalElements());
    }

    @Override
    public List<Pathologie> fetchBagRelationships(List<Pathologie> pathologies) {
        return Optional.of(pathologies).map(this::fetchConsultations).orElse(Collections.emptyList());
    }

    Pathologie fetchConsultations(Pathologie result) {
        return entityManager
            .createQuery(
                "select pathologie from Pathologie pathologie left join fetch pathologie.consultations where pathologie is :pathologie",
                Pathologie.class
            )
            .setParameter("pathologie", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Pathologie> fetchConsultations(List<Pathologie> pathologies) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, pathologies.size()).forEach(index -> order.put(pathologies.get(index).getId(), index));
        List<Pathologie> result = entityManager
            .createQuery(
                "select distinct pathologie from Pathologie pathologie left join fetch pathologie.consultations where pathologie in :pathologies",
                Pathologie.class
            )
            .setParameter("pathologies", pathologies)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
