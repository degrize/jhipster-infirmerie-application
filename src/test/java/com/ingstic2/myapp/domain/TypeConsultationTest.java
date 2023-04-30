package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeConsultationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeConsultation.class);
        TypeConsultation typeConsultation1 = new TypeConsultation();
        typeConsultation1.setId(1L);
        TypeConsultation typeConsultation2 = new TypeConsultation();
        typeConsultation2.setId(typeConsultation1.getId());
        assertThat(typeConsultation1).isEqualTo(typeConsultation2);
        typeConsultation2.setId(2L);
        assertThat(typeConsultation1).isNotEqualTo(typeConsultation2);
        typeConsultation1.setId(null);
        assertThat(typeConsultation1).isNotEqualTo(typeConsultation2);
    }
}
