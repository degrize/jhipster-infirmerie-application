package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.MiseEnObservation;
import com.ingstic2.myapp.repository.MiseEnObservationRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MiseEnObservationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MiseEnObservationResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mise-en-observations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MiseEnObservationRepository miseEnObservationRepository;

    @Mock
    private MiseEnObservationRepository miseEnObservationRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMiseEnObservationMockMvc;

    private MiseEnObservation miseEnObservation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MiseEnObservation createEntity(EntityManager em) {
        MiseEnObservation miseEnObservation = new MiseEnObservation()
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .description(DEFAULT_DESCRIPTION);
        return miseEnObservation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MiseEnObservation createUpdatedEntity(EntityManager em) {
        MiseEnObservation miseEnObservation = new MiseEnObservation()
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .description(UPDATED_DESCRIPTION);
        return miseEnObservation;
    }

    @BeforeEach
    public void initTest() {
        miseEnObservation = createEntity(em);
    }

    @Test
    @Transactional
    void createMiseEnObservation() throws Exception {
        int databaseSizeBeforeCreate = miseEnObservationRepository.findAll().size();
        // Create the MiseEnObservation
        restMiseEnObservationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isCreated());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeCreate + 1);
        MiseEnObservation testMiseEnObservation = miseEnObservationList.get(miseEnObservationList.size() - 1);
        assertThat(testMiseEnObservation.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testMiseEnObservation.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testMiseEnObservation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createMiseEnObservationWithExistingId() throws Exception {
        // Create the MiseEnObservation with an existing ID
        miseEnObservation.setId(1L);

        int databaseSizeBeforeCreate = miseEnObservationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMiseEnObservationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMiseEnObservations() throws Exception {
        // Initialize the database
        miseEnObservationRepository.saveAndFlush(miseEnObservation);

        // Get all the miseEnObservationList
        restMiseEnObservationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(miseEnObservation.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMiseEnObservationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(miseEnObservationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMiseEnObservationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(miseEnObservationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMiseEnObservationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(miseEnObservationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMiseEnObservationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(miseEnObservationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMiseEnObservation() throws Exception {
        // Initialize the database
        miseEnObservationRepository.saveAndFlush(miseEnObservation);

        // Get the miseEnObservation
        restMiseEnObservationMockMvc
            .perform(get(ENTITY_API_URL_ID, miseEnObservation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(miseEnObservation.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingMiseEnObservation() throws Exception {
        // Get the miseEnObservation
        restMiseEnObservationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMiseEnObservation() throws Exception {
        // Initialize the database
        miseEnObservationRepository.saveAndFlush(miseEnObservation);

        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();

        // Update the miseEnObservation
        MiseEnObservation updatedMiseEnObservation = miseEnObservationRepository.findById(miseEnObservation.getId()).get();
        // Disconnect from session so that the updates on updatedMiseEnObservation are not directly saved in db
        em.detach(updatedMiseEnObservation);
        updatedMiseEnObservation.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN).description(UPDATED_DESCRIPTION);

        restMiseEnObservationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMiseEnObservation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMiseEnObservation))
            )
            .andExpect(status().isOk());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
        MiseEnObservation testMiseEnObservation = miseEnObservationList.get(miseEnObservationList.size() - 1);
        assertThat(testMiseEnObservation.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMiseEnObservation.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testMiseEnObservation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingMiseEnObservation() throws Exception {
        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();
        miseEnObservation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMiseEnObservationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, miseEnObservation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMiseEnObservation() throws Exception {
        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();
        miseEnObservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiseEnObservationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMiseEnObservation() throws Exception {
        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();
        miseEnObservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiseEnObservationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMiseEnObservationWithPatch() throws Exception {
        // Initialize the database
        miseEnObservationRepository.saveAndFlush(miseEnObservation);

        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();

        // Update the miseEnObservation using partial update
        MiseEnObservation partialUpdatedMiseEnObservation = new MiseEnObservation();
        partialUpdatedMiseEnObservation.setId(miseEnObservation.getId());

        partialUpdatedMiseEnObservation.description(UPDATED_DESCRIPTION);

        restMiseEnObservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMiseEnObservation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMiseEnObservation))
            )
            .andExpect(status().isOk());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
        MiseEnObservation testMiseEnObservation = miseEnObservationList.get(miseEnObservationList.size() - 1);
        assertThat(testMiseEnObservation.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testMiseEnObservation.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testMiseEnObservation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateMiseEnObservationWithPatch() throws Exception {
        // Initialize the database
        miseEnObservationRepository.saveAndFlush(miseEnObservation);

        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();

        // Update the miseEnObservation using partial update
        MiseEnObservation partialUpdatedMiseEnObservation = new MiseEnObservation();
        partialUpdatedMiseEnObservation.setId(miseEnObservation.getId());

        partialUpdatedMiseEnObservation.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN).description(UPDATED_DESCRIPTION);

        restMiseEnObservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMiseEnObservation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMiseEnObservation))
            )
            .andExpect(status().isOk());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
        MiseEnObservation testMiseEnObservation = miseEnObservationList.get(miseEnObservationList.size() - 1);
        assertThat(testMiseEnObservation.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMiseEnObservation.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testMiseEnObservation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingMiseEnObservation() throws Exception {
        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();
        miseEnObservation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMiseEnObservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, miseEnObservation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMiseEnObservation() throws Exception {
        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();
        miseEnObservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiseEnObservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMiseEnObservation() throws Exception {
        int databaseSizeBeforeUpdate = miseEnObservationRepository.findAll().size();
        miseEnObservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiseEnObservationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(miseEnObservation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MiseEnObservation in the database
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMiseEnObservation() throws Exception {
        // Initialize the database
        miseEnObservationRepository.saveAndFlush(miseEnObservation);

        int databaseSizeBeforeDelete = miseEnObservationRepository.findAll().size();

        // Delete the miseEnObservation
        restMiseEnObservationMockMvc
            .perform(delete(ENTITY_API_URL_ID, miseEnObservation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MiseEnObservation> miseEnObservationList = miseEnObservationRepository.findAll();
        assertThat(miseEnObservationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
