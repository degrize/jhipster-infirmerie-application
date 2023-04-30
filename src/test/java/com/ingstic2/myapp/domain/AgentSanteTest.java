package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AgentSanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AgentSante.class);
        AgentSante agentSante1 = new AgentSante();
        agentSante1.setId(1L);
        AgentSante agentSante2 = new AgentSante();
        agentSante2.setId(agentSante1.getId());
        assertThat(agentSante1).isEqualTo(agentSante2);
        agentSante2.setId(2L);
        assertThat(agentSante1).isNotEqualTo(agentSante2);
        agentSante1.setId(null);
        assertThat(agentSante1).isNotEqualTo(agentSante2);
    }
}
