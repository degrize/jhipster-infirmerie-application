package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.TypeConsultation;
import com.ingstic2.myapp.repository.TypeConsultationRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TypeConsultationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeConsultationResourceIT {

    private static final String DEFAULT_LIBELLE_TYPE_CONSULTATION = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE_TYPE_CONSULTATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-consultations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeConsultationRepository typeConsultationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeConsultationMockMvc;

    private TypeConsultation typeConsultation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeConsultation createEntity(EntityManager em) {
        TypeConsultation typeConsultation = new TypeConsultation().libelleTypeConsultation(DEFAULT_LIBELLE_TYPE_CONSULTATION);
        return typeConsultation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeConsultation createUpdatedEntity(EntityManager em) {
        TypeConsultation typeConsultation = new TypeConsultation().libelleTypeConsultation(UPDATED_LIBELLE_TYPE_CONSULTATION);
        return typeConsultation;
    }

    @BeforeEach
    public void initTest() {
        typeConsultation = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeConsultation() throws Exception {
        int databaseSizeBeforeCreate = typeConsultationRepository.findAll().size();
        // Create the TypeConsultation
        restTypeConsultationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isCreated());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeCreate + 1);
        TypeConsultation testTypeConsultation = typeConsultationList.get(typeConsultationList.size() - 1);
        assertThat(testTypeConsultation.getLibelleTypeConsultation()).isEqualTo(DEFAULT_LIBELLE_TYPE_CONSULTATION);
    }

    @Test
    @Transactional
    void createTypeConsultationWithExistingId() throws Exception {
        // Create the TypeConsultation with an existing ID
        typeConsultation.setId(1L);

        int databaseSizeBeforeCreate = typeConsultationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeConsultationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeConsultations() throws Exception {
        // Initialize the database
        typeConsultationRepository.saveAndFlush(typeConsultation);

        // Get all the typeConsultationList
        restTypeConsultationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeConsultation.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelleTypeConsultation").value(hasItem(DEFAULT_LIBELLE_TYPE_CONSULTATION)));
    }

    @Test
    @Transactional
    void getTypeConsultation() throws Exception {
        // Initialize the database
        typeConsultationRepository.saveAndFlush(typeConsultation);

        // Get the typeConsultation
        restTypeConsultationMockMvc
            .perform(get(ENTITY_API_URL_ID, typeConsultation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeConsultation.getId().intValue()))
            .andExpect(jsonPath("$.libelleTypeConsultation").value(DEFAULT_LIBELLE_TYPE_CONSULTATION));
    }

    @Test
    @Transactional
    void getNonExistingTypeConsultation() throws Exception {
        // Get the typeConsultation
        restTypeConsultationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTypeConsultation() throws Exception {
        // Initialize the database
        typeConsultationRepository.saveAndFlush(typeConsultation);

        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();

        // Update the typeConsultation
        TypeConsultation updatedTypeConsultation = typeConsultationRepository.findById(typeConsultation.getId()).get();
        // Disconnect from session so that the updates on updatedTypeConsultation are not directly saved in db
        em.detach(updatedTypeConsultation);
        updatedTypeConsultation.libelleTypeConsultation(UPDATED_LIBELLE_TYPE_CONSULTATION);

        restTypeConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeConsultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeConsultation))
            )
            .andExpect(status().isOk());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
        TypeConsultation testTypeConsultation = typeConsultationList.get(typeConsultationList.size() - 1);
        assertThat(testTypeConsultation.getLibelleTypeConsultation()).isEqualTo(UPDATED_LIBELLE_TYPE_CONSULTATION);
    }

    @Test
    @Transactional
    void putNonExistingTypeConsultation() throws Exception {
        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();
        typeConsultation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeConsultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeConsultation() throws Exception {
        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();
        typeConsultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeConsultation() throws Exception {
        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();
        typeConsultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeConsultationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeConsultationWithPatch() throws Exception {
        // Initialize the database
        typeConsultationRepository.saveAndFlush(typeConsultation);

        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();

        // Update the typeConsultation using partial update
        TypeConsultation partialUpdatedTypeConsultation = new TypeConsultation();
        partialUpdatedTypeConsultation.setId(typeConsultation.getId());

        partialUpdatedTypeConsultation.libelleTypeConsultation(UPDATED_LIBELLE_TYPE_CONSULTATION);

        restTypeConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeConsultation))
            )
            .andExpect(status().isOk());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
        TypeConsultation testTypeConsultation = typeConsultationList.get(typeConsultationList.size() - 1);
        assertThat(testTypeConsultation.getLibelleTypeConsultation()).isEqualTo(UPDATED_LIBELLE_TYPE_CONSULTATION);
    }

    @Test
    @Transactional
    void fullUpdateTypeConsultationWithPatch() throws Exception {
        // Initialize the database
        typeConsultationRepository.saveAndFlush(typeConsultation);

        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();

        // Update the typeConsultation using partial update
        TypeConsultation partialUpdatedTypeConsultation = new TypeConsultation();
        partialUpdatedTypeConsultation.setId(typeConsultation.getId());

        partialUpdatedTypeConsultation.libelleTypeConsultation(UPDATED_LIBELLE_TYPE_CONSULTATION);

        restTypeConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeConsultation))
            )
            .andExpect(status().isOk());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
        TypeConsultation testTypeConsultation = typeConsultationList.get(typeConsultationList.size() - 1);
        assertThat(testTypeConsultation.getLibelleTypeConsultation()).isEqualTo(UPDATED_LIBELLE_TYPE_CONSULTATION);
    }

    @Test
    @Transactional
    void patchNonExistingTypeConsultation() throws Exception {
        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();
        typeConsultation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeConsultation() throws Exception {
        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();
        typeConsultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeConsultation() throws Exception {
        int databaseSizeBeforeUpdate = typeConsultationRepository.findAll().size();
        typeConsultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeConsultation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeConsultation in the database
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeConsultation() throws Exception {
        // Initialize the database
        typeConsultationRepository.saveAndFlush(typeConsultation);

        int databaseSizeBeforeDelete = typeConsultationRepository.findAll().size();

        // Delete the typeConsultation
        restTypeConsultationMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeConsultation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeConsultation> typeConsultationList = typeConsultationRepository.findAll();
        assertThat(typeConsultationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
