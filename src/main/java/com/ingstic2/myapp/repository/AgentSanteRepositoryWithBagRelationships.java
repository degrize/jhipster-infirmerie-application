package com.ingstic2.myapp.repository;

import com.ingstic2.myapp.domain.AgentSante;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface AgentSanteRepositoryWithBagRelationships {
    Optional<AgentSante> fetchBagRelationships(Optional<AgentSante> agentSante);

    List<AgentSante> fetchBagRelationships(List<AgentSante> agentSantes);

    Page<AgentSante> fetchBagRelationships(Page<AgentSante> agentSantes);
}
