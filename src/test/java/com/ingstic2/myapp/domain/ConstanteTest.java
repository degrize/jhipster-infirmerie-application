package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConstanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Constante.class);
        Constante constante1 = new Constante();
        constante1.setId(1L);
        Constante constante2 = new Constante();
        constante2.setId(constante1.getId());
        assertThat(constante1).isEqualTo(constante2);
        constante2.setId(2L);
        assertThat(constante1).isNotEqualTo(constante2);
        constante1.setId(null);
        assertThat(constante1).isNotEqualTo(constante2);
    }
}
