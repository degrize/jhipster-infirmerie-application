package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeAgentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeAgent.class);
        TypeAgent typeAgent1 = new TypeAgent();
        typeAgent1.setId(1L);
        TypeAgent typeAgent2 = new TypeAgent();
        typeAgent2.setId(typeAgent1.getId());
        assertThat(typeAgent1).isEqualTo(typeAgent2);
        typeAgent2.setId(2L);
        assertThat(typeAgent1).isNotEqualTo(typeAgent2);
        typeAgent1.setId(null);
        assertThat(typeAgent1).isNotEqualTo(typeAgent2);
    }
}
