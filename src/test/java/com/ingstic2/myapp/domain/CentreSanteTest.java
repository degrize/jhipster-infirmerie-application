package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CentreSanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CentreSante.class);
        CentreSante centreSante1 = new CentreSante();
        centreSante1.setId(1L);
        CentreSante centreSante2 = new CentreSante();
        centreSante2.setId(centreSante1.getId());
        assertThat(centreSante1).isEqualTo(centreSante2);
        centreSante2.setId(2L);
        assertThat(centreSante1).isNotEqualTo(centreSante2);
        centreSante1.setId(null);
        assertThat(centreSante1).isNotEqualTo(centreSante2);
    }
}
