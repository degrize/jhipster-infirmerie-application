package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RdvTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Rdv.class);
        Rdv rdv1 = new Rdv();
        rdv1.setId(1L);
        Rdv rdv2 = new Rdv();
        rdv2.setId(rdv1.getId());
        assertThat(rdv1).isEqualTo(rdv2);
        rdv2.setId(2L);
        assertThat(rdv1).isNotEqualTo(rdv2);
        rdv1.setId(null);
        assertThat(rdv1).isNotEqualTo(rdv2);
    }
}
