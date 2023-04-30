package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.TypeMedicament;
import com.ingstic2.myapp.repository.TypeMedicamentRepository;
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
 * Integration tests for the {@link TypeMedicamentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeMedicamentResourceIT {

    private static final String DEFAULT_TYPE_MEDICAMENT = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_MEDICAMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-medicaments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeMedicamentRepository typeMedicamentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeMedicamentMockMvc;

    private TypeMedicament typeMedicament;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeMedicament createEntity(EntityManager em) {
        TypeMedicament typeMedicament = new TypeMedicament().typeMedicament(DEFAULT_TYPE_MEDICAMENT);
        return typeMedicament;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeMedicament createUpdatedEntity(EntityManager em) {
        TypeMedicament typeMedicament = new TypeMedicament().typeMedicament(UPDATED_TYPE_MEDICAMENT);
        return typeMedicament;
    }

    @BeforeEach
    public void initTest() {
        typeMedicament = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeMedicament() throws Exception {
        int databaseSizeBeforeCreate = typeMedicamentRepository.findAll().size();
        // Create the TypeMedicament
        restTypeMedicamentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeMedicament))
            )
            .andExpect(status().isCreated());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeCreate + 1);
        TypeMedicament testTypeMedicament = typeMedicamentList.get(typeMedicamentList.size() - 1);
        assertThat(testTypeMedicament.getTypeMedicament()).isEqualTo(DEFAULT_TYPE_MEDICAMENT);
    }

    @Test
    @Transactional
    void createTypeMedicamentWithExistingId() throws Exception {
        // Create the TypeMedicament with an existing ID
        typeMedicament.setId(1L);

        int databaseSizeBeforeCreate = typeMedicamentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeMedicamentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeMedicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeMedicaments() throws Exception {
        // Initialize the database
        typeMedicamentRepository.saveAndFlush(typeMedicament);

        // Get all the typeMedicamentList
        restTypeMedicamentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeMedicament.getId().intValue())))
            .andExpect(jsonPath("$.[*].typeMedicament").value(hasItem(DEFAULT_TYPE_MEDICAMENT)));
    }

    @Test
    @Transactional
    void getTypeMedicament() throws Exception {
        // Initialize the database
        typeMedicamentRepository.saveAndFlush(typeMedicament);

        // Get the typeMedicament
        restTypeMedicamentMockMvc
            .perform(get(ENTITY_API_URL_ID, typeMedicament.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeMedicament.getId().intValue()))
            .andExpect(jsonPath("$.typeMedicament").value(DEFAULT_TYPE_MEDICAMENT));
    }

    @Test
    @Transactional
    void getNonExistingTypeMedicament() throws Exception {
        // Get the typeMedicament
        restTypeMedicamentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTypeMedicament() throws Exception {
        // Initialize the database
        typeMedicamentRepository.saveAndFlush(typeMedicament);

        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();

        // Update the typeMedicament
        TypeMedicament updatedTypeMedicament = typeMedicamentRepository.findById(typeMedicament.getId()).get();
        // Disconnect from session so that the updates on updatedTypeMedicament are not directly saved in db
        em.detach(updatedTypeMedicament);
        updatedTypeMedicament.typeMedicament(UPDATED_TYPE_MEDICAMENT);

        restTypeMedicamentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeMedicament.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeMedicament))
            )
            .andExpect(status().isOk());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
        TypeMedicament testTypeMedicament = typeMedicamentList.get(typeMedicamentList.size() - 1);
        assertThat(testTypeMedicament.getTypeMedicament()).isEqualTo(UPDATED_TYPE_MEDICAMENT);
    }

    @Test
    @Transactional
    void putNonExistingTypeMedicament() throws Exception {
        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();
        typeMedicament.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeMedicamentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeMedicament.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeMedicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeMedicament() throws Exception {
        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();
        typeMedicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMedicamentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeMedicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeMedicament() throws Exception {
        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();
        typeMedicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMedicamentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeMedicament)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeMedicamentWithPatch() throws Exception {
        // Initialize the database
        typeMedicamentRepository.saveAndFlush(typeMedicament);

        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();

        // Update the typeMedicament using partial update
        TypeMedicament partialUpdatedTypeMedicament = new TypeMedicament();
        partialUpdatedTypeMedicament.setId(typeMedicament.getId());

        partialUpdatedTypeMedicament.typeMedicament(UPDATED_TYPE_MEDICAMENT);

        restTypeMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeMedicament.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeMedicament))
            )
            .andExpect(status().isOk());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
        TypeMedicament testTypeMedicament = typeMedicamentList.get(typeMedicamentList.size() - 1);
        assertThat(testTypeMedicament.getTypeMedicament()).isEqualTo(UPDATED_TYPE_MEDICAMENT);
    }

    @Test
    @Transactional
    void fullUpdateTypeMedicamentWithPatch() throws Exception {
        // Initialize the database
        typeMedicamentRepository.saveAndFlush(typeMedicament);

        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();

        // Update the typeMedicament using partial update
        TypeMedicament partialUpdatedTypeMedicament = new TypeMedicament();
        partialUpdatedTypeMedicament.setId(typeMedicament.getId());

        partialUpdatedTypeMedicament.typeMedicament(UPDATED_TYPE_MEDICAMENT);

        restTypeMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeMedicament.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeMedicament))
            )
            .andExpect(status().isOk());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
        TypeMedicament testTypeMedicament = typeMedicamentList.get(typeMedicamentList.size() - 1);
        assertThat(testTypeMedicament.getTypeMedicament()).isEqualTo(UPDATED_TYPE_MEDICAMENT);
    }

    @Test
    @Transactional
    void patchNonExistingTypeMedicament() throws Exception {
        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();
        typeMedicament.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeMedicament.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeMedicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeMedicament() throws Exception {
        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();
        typeMedicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeMedicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeMedicament() throws Exception {
        int databaseSizeBeforeUpdate = typeMedicamentRepository.findAll().size();
        typeMedicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typeMedicament))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeMedicament in the database
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeMedicament() throws Exception {
        // Initialize the database
        typeMedicamentRepository.saveAndFlush(typeMedicament);

        int databaseSizeBeforeDelete = typeMedicamentRepository.findAll().size();

        // Delete the typeMedicament
        restTypeMedicamentMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeMedicament.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeMedicament> typeMedicamentList = typeMedicamentRepository.findAll();
        assertThat(typeMedicamentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
