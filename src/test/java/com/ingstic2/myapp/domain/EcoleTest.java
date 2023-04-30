package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EcoleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ecole.class);
        Ecole ecole1 = new Ecole();
        ecole1.setId(1L);
        Ecole ecole2 = new Ecole();
        ecole2.setId(ecole1.getId());
        assertThat(ecole1).isEqualTo(ecole2);
        ecole2.setId(2L);
        assertThat(ecole1).isNotEqualTo(ecole2);
        ecole1.setId(null);
        assertThat(ecole1).isNotEqualTo(ecole2);
    }
}
