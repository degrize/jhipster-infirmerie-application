package com.ingstic2.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ingstic2.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MiseEnObservationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MiseEnObservation.class);
        MiseEnObservation miseEnObservation1 = new MiseEnObservation();
        miseEnObservation1.setId(1L);
        MiseEnObservation miseEnObservation2 = new MiseEnObservation();
        miseEnObservation2.setId(miseEnObservation1.getId());
        assertThat(miseEnObservation1).isEqualTo(miseEnObservation2);
        miseEnObservation2.setId(2L);
        assertThat(miseEnObservation1).isNotEqualTo(miseEnObservation2);
        miseEnObservation1.setId(null);
        assertThat(miseEnObservation1).isNotEqualTo(miseEnObservation2);
    }
}
