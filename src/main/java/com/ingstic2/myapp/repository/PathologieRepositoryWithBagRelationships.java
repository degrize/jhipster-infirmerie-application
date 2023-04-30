package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.Pathologie;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PathologieRepositoryWithBagRelationships {
    Optional<Pathologie> fetchBagRelationships(Optional<Pathologie> pathologie);

    List<Pathologie> fetchBagRelationships(List<Pathologie> pathologies);

    Page<Pathologie> fetchBagRelationships(Page<Pathologie> pathologies);
}
