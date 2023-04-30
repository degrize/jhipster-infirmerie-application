package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypePathologieTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypePathologie.class);
        TypePathologie typePathologie1 = new TypePathologie();
        typePathologie1.setId(1L);
        TypePathologie typePathologie2 = new TypePathologie();
        typePathologie2.setId(typePathologie1.getId());
        assertThat(typePathologie1).isEqualTo(typePathologie2);
        typePathologie2.setId(2L);
        assertThat(typePathologie1).isNotEqualTo(typePathologie2);
        typePathologie1.setId(null);
        assertThat(typePathologie1).isNotEqualTo(typePathologie2);
    }
}
