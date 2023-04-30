package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Consultation;
import com.ingstic2.myapp.repository.ConsultationRepository;
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
 * Integration tests for the {@link ConsultationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ConsultationResourceIT {

    private static final LocalDate DEFAULT_DATE_CONSULTATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CONSULTATION = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_MOTIF = "AAAAAAAAAA";
    private static final String UPDATED_MOTIF = "BBBBBBBBBB";

    private static final String DEFAULT_DIAGNOSTIC = "AAAAAAAAAA";
    private static final String UPDATED_DIAGNOSTIC = "BBBBBBBBBB";

    private static final String DEFAULT_CONSULTATION_OBSERVATION = "AAAAAAAAAA";
    private static final String UPDATED_CONSULTATION_OBSERVATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/consultations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsultationRepository consultationRepository;

    @Mock
    private ConsultationRepository consultationRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsultationMockMvc;

    private Consultation consultation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultation createEntity(EntityManager em) {
        Consultation consultation = new Consultation()
            .dateConsultation(DEFAULT_DATE_CONSULTATION)
            .motif(DEFAULT_MOTIF)
            .diagnostic(DEFAULT_DIAGNOSTIC)
            .consultationObservation(DEFAULT_CONSULTATION_OBSERVATION);
        return consultation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultation createUpdatedEntity(EntityManager em) {
        Consultation consultation = new Consultation()
            .dateConsultation(UPDATED_DATE_CONSULTATION)
            .motif(UPDATED_MOTIF)
            .diagnostic(UPDATED_DIAGNOSTIC)
            .consultationObservation(UPDATED_CONSULTATION_OBSERVATION);
        return consultation;
    }

    @BeforeEach
    public void initTest() {
        consultation = createEntity(em);
    }

    @Test
    @Transactional
    void createConsultation() throws Exception {
        int databaseSizeBeforeCreate = consultationRepository.findAll().size();
        // Create the Consultation
        restConsultationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isCreated());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeCreate + 1);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(DEFAULT_DATE_CONSULTATION);
        assertThat(testConsultation.getMotif()).isEqualTo(DEFAULT_MOTIF);
        assertThat(testConsultation.getDiagnostic()).isEqualTo(DEFAULT_DIAGNOSTIC);
        assertThat(testConsultation.getConsultationObservation()).isEqualTo(DEFAULT_CONSULTATION_OBSERVATION);
    }

    @Test
    @Transactional
    void createConsultationWithExistingId() throws Exception {
        // Create the Consultation with an existing ID
        consultation.setId(1L);

        int databaseSizeBeforeCreate = consultationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsultationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConsultations() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        // Get all the consultationList
        restConsultationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consultation.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateConsultation").value(hasItem(DEFAULT_DATE_CONSULTATION.toString())))
            .andExpect(jsonPath("$.[*].motif").value(hasItem(DEFAULT_MOTIF)))
            .andExpect(jsonPath("$.[*].diagnostic").value(hasItem(DEFAULT_DIAGNOSTIC)))
            .andExpect(jsonPath("$.[*].consultationObservation").value(hasItem(DEFAULT_CONSULTATION_OBSERVATION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllConsultationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(consultationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restConsultationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(consultationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllConsultationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(consultationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restConsultationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(consultationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getConsultation() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        // Get the consultation
        restConsultationMockMvc
            .perform(get(ENTITY_API_URL_ID, consultation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consultation.getId().intValue()))
            .andExpect(jsonPath("$.dateConsultation").value(DEFAULT_DATE_CONSULTATION.toString()))
            .andExpect(jsonPath("$.motif").value(DEFAULT_MOTIF))
            .andExpect(jsonPath("$.diagnostic").value(DEFAULT_DIAGNOSTIC))
            .andExpect(jsonPath("$.consultationObservation").value(DEFAULT_CONSULTATION_OBSERVATION));
    }

    @Test
    @Transactional
    void getNonExistingConsultation() throws Exception {
        // Get the consultation
        restConsultationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConsultation() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation
        Consultation updatedConsultation = consultationRepository.findById(consultation.getId()).get();
        // Disconnect from session so that the updates on updatedConsultation are not directly saved in db
        em.detach(updatedConsultation);
        updatedConsultation
            .dateConsultation(UPDATED_DATE_CONSULTATION)
            .motif(UPDATED_MOTIF)
            .diagnostic(UPDATED_DIAGNOSTIC)
            .consultationObservation(UPDATED_CONSULTATION_OBSERVATION);

        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(UPDATED_DATE_CONSULTATION);
        assertThat(testConsultation.getMotif()).isEqualTo(UPDATED_MOTIF);
        assertThat(testConsultation.getDiagnostic()).isEqualTo(UPDATED_DIAGNOSTIC);
        assertThat(testConsultation.getConsultationObservation()).isEqualTo(UPDATED_CONSULTATION_OBSERVATION);
    }

    @Test
    @Transactional
    void putNonExistingConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsultationWithPatch() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation using partial update
        Consultation partialUpdatedConsultation = new Consultation();
        partialUpdatedConsultation.setId(consultation.getId());

        partialUpdatedConsultation.motif(UPDATED_MOTIF).consultationObservation(UPDATED_CONSULTATION_OBSERVATION);

        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(DEFAULT_DATE_CONSULTATION);
        assertThat(testConsultation.getMotif()).isEqualTo(UPDATED_MOTIF);
        assertThat(testConsultation.getDiagnostic()).isEqualTo(DEFAULT_DIAGNOSTIC);
        assertThat(testConsultation.getConsultationObservation()).isEqualTo(UPDATED_CONSULTATION_OBSERVATION);
    }

    @Test
    @Transactional
    void fullUpdateConsultationWithPatch() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation using partial update
        Consultation partialUpdatedConsultation = new Consultation();
        partialUpdatedConsultation.setId(consultation.getId());

        partialUpdatedConsultation
            .dateConsultation(UPDATED_DATE_CONSULTATION)
            .motif(UPDATED_MOTIF)
            .diagnostic(UPDATED_DIAGNOSTIC)
            .consultationObservation(UPDATED_CONSULTATION_OBSERVATION);

        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(UPDATED_DATE_CONSULTATION);
        assertThat(testConsultation.getMotif()).isEqualTo(UPDATED_MOTIF);
        assertThat(testConsultation.getDiagnostic()).isEqualTo(UPDATED_DIAGNOSTIC);
        assertThat(testConsultation.getConsultationObservation()).isEqualTo(UPDATED_CONSULTATION_OBSERVATION);
    }

    @Test
    @Transactional
    void patchNonExistingConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsultation() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeDelete = consultationRepository.findAll().size();

        // Delete the consultation
        restConsultationMockMvc
            .perform(delete(ENTITY_API_URL_ID, consultation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
