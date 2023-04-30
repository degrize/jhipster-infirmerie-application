package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeMedicamentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeMedicament.class);
        TypeMedicament typeMedicament1 = new TypeMedicament();
        typeMedicament1.setId(1L);
        TypeMedicament typeMedicament2 = new TypeMedicament();
        typeMedicament2.setId(typeMedicament1.getId());
        assertThat(typeMedicament1).isEqualTo(typeMedicament2);
        typeMedicament2.setId(2L);
        assertThat(typeMedicament1).isNotEqualTo(typeMedicament2);
        typeMedicament1.setId(null);
        assertThat(typeMedicament1).isNotEqualTo(typeMedicament2);
    }
}
