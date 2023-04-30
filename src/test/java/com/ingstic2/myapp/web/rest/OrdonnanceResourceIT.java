package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Ordonnance;
import com.ingstic2.myapp.repository.OrdonnanceRepository;
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
 * Integration tests for the {@link OrdonnanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrdonnanceResourceIT {

    private static final String DEFAULT_ORDONNANCE_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_ORDONNANCE_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ordonnances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrdonnanceRepository ordonnanceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrdonnanceMockMvc;

    private Ordonnance ordonnance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordonnance createEntity(EntityManager em) {
        Ordonnance ordonnance = new Ordonnance().ordonnanceDescription(DEFAULT_ORDONNANCE_DESCRIPTION);
        return ordonnance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordonnance createUpdatedEntity(EntityManager em) {
        Ordonnance ordonnance = new Ordonnance().ordonnanceDescription(UPDATED_ORDONNANCE_DESCRIPTION);
        return ordonnance;
    }

    @BeforeEach
    public void initTest() {
        ordonnance = createEntity(em);
    }

    @Test
    @Transactional
    void createOrdonnance() throws Exception {
        int databaseSizeBeforeCreate = ordonnanceRepository.findAll().size();
        // Create the Ordonnance
        restOrdonnanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnance)))
            .andExpect(status().isCreated());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeCreate + 1);
        Ordonnance testOrdonnance = ordonnanceList.get(ordonnanceList.size() - 1);
        assertThat(testOrdonnance.getOrdonnanceDescription()).isEqualTo(DEFAULT_ORDONNANCE_DESCRIPTION);
    }

    @Test
    @Transactional
    void createOrdonnanceWithExistingId() throws Exception {
        // Create the Ordonnance with an existing ID
        ordonnance.setId(1L);

        int databaseSizeBeforeCreate = ordonnanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrdonnanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnance)))
            .andExpect(status().isBadRequest());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrdonnances() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        // Get all the ordonnanceList
        restOrdonnanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ordonnance.getId().intValue())))
            .andExpect(jsonPath("$.[*].ordonnanceDescription").value(hasItem(DEFAULT_ORDONNANCE_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getOrdonnance() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        // Get the ordonnance
        restOrdonnanceMockMvc
            .perform(get(ENTITY_API_URL_ID, ordonnance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ordonnance.getId().intValue()))
            .andExpect(jsonPath("$.ordonnanceDescription").value(DEFAULT_ORDONNANCE_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingOrdonnance() throws Exception {
        // Get the ordonnance
        restOrdonnanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrdonnance() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();

        // Update the ordonnance
        Ordonnance updatedOrdonnance = ordonnanceRepository.findById(ordonnance.getId()).get();
        // Disconnect from session so that the updates on updatedOrdonnance are not directly saved in db
        em.detach(updatedOrdonnance);
        updatedOrdonnance.ordonnanceDescription(UPDATED_ORDONNANCE_DESCRIPTION);

        restOrdonnanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrdonnance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrdonnance))
            )
            .andExpect(status().isOk());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
        Ordonnance testOrdonnance = ordonnanceList.get(ordonnanceList.size() - 1);
        assertThat(testOrdonnance.getOrdonnanceDescription()).isEqualTo(UPDATED_ORDONNANCE_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingOrdonnance() throws Exception {
        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();
        ordonnance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrdonnanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ordonnance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ordonnance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrdonnance() throws Exception {
        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();
        ordonnance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ordonnance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrdonnance() throws Exception {
        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();
        ordonnance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnanceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnance)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrdonnanceWithPatch() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();

        // Update the ordonnance using partial update
        Ordonnance partialUpdatedOrdonnance = new Ordonnance();
        partialUpdatedOrdonnance.setId(ordonnance.getId());

        restOrdonnanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrdonnance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrdonnance))
            )
            .andExpect(status().isOk());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
        Ordonnance testOrdonnance = ordonnanceList.get(ordonnanceList.size() - 1);
        assertThat(testOrdonnance.getOrdonnanceDescription()).isEqualTo(DEFAULT_ORDONNANCE_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateOrdonnanceWithPatch() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();

        // Update the ordonnance using partial update
        Ordonnance partialUpdatedOrdonnance = new Ordonnance();
        partialUpdatedOrdonnance.setId(ordonnance.getId());

        partialUpdatedOrdonnance.ordonnanceDescription(UPDATED_ORDONNANCE_DESCRIPTION);

        restOrdonnanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrdonnance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrdonnance))
            )
            .andExpect(status().isOk());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
        Ordonnance testOrdonnance = ordonnanceList.get(ordonnanceList.size() - 1);
        assertThat(testOrdonnance.getOrdonnanceDescription()).isEqualTo(UPDATED_ORDONNANCE_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingOrdonnance() throws Exception {
        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();
        ordonnance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrdonnanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ordonnance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ordonnance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrdonnance() throws Exception {
        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();
        ordonnance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ordonnance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrdonnance() throws Exception {
        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();
        ordonnance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnanceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ordonnance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrdonnance() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        int databaseSizeBeforeDelete = ordonnanceRepository.findAll().size();

        // Delete the ordonnance
        restOrdonnanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, ordonnance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
