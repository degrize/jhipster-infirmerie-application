package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Medicament;
import com.ingstic2.myapp.repository.MedicamentRepository;
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
 * Integration tests for the {@link MedicamentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MedicamentResourceIT {

    private static final String DEFAULT_MEDICAMENT = "AAAAAAAAAA";
    private static final String UPDATED_MEDICAMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/medicaments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Mock
    private MedicamentRepository medicamentRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMedicamentMockMvc;

    private Medicament medicament;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Medicament createEntity(EntityManager em) {
        Medicament medicament = new Medicament().medicament(DEFAULT_MEDICAMENT);
        return medicament;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Medicament createUpdatedEntity(EntityManager em) {
        Medicament medicament = new Medicament().medicament(UPDATED_MEDICAMENT);
        return medicament;
    }

    @BeforeEach
    public void initTest() {
        medicament = createEntity(em);
    }

    @Test
    @Transactional
    void createMedicament() throws Exception {
        int databaseSizeBeforeCreate = medicamentRepository.findAll().size();
        // Create the Medicament
        restMedicamentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicament)))
            .andExpect(status().isCreated());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeCreate + 1);
        Medicament testMedicament = medicamentList.get(medicamentList.size() - 1);
        assertThat(testMedicament.getMedicament()).isEqualTo(DEFAULT_MEDICAMENT);
    }

    @Test
    @Transactional
    void createMedicamentWithExistingId() throws Exception {
        // Create the Medicament with an existing ID
        medicament.setId(1L);

        int databaseSizeBeforeCreate = medicamentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMedicamentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicament)))
            .andExpect(status().isBadRequest());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMedicaments() throws Exception {
        // Initialize the database
        medicamentRepository.saveAndFlush(medicament);

        // Get all the medicamentList
        restMedicamentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(medicament.getId().intValue())))
            .andExpect(jsonPath("$.[*].medicament").value(hasItem(DEFAULT_MEDICAMENT)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMedicamentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(medicamentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMedicamentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(medicamentRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMedicamentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(medicamentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMedicamentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(medicamentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMedicament() throws Exception {
        // Initialize the database
        medicamentRepository.saveAndFlush(medicament);

        // Get the medicament
        restMedicamentMockMvc
            .perform(get(ENTITY_API_URL_ID, medicament.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(medicament.getId().intValue()))
            .andExpect(jsonPath("$.medicament").value(DEFAULT_MEDICAMENT));
    }

    @Test
    @Transactional
    void getNonExistingMedicament() throws Exception {
        // Get the medicament
        restMedicamentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMedicament() throws Exception {
        // Initialize the database
        medicamentRepository.saveAndFlush(medicament);

        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();

        // Update the medicament
        Medicament updatedMedicament = medicamentRepository.findById(medicament.getId()).get();
        // Disconnect from session so that the updates on updatedMedicament are not directly saved in db
        em.detach(updatedMedicament);
        updatedMedicament.medicament(UPDATED_MEDICAMENT);

        restMedicamentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMedicament.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMedicament))
            )
            .andExpect(status().isOk());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
        Medicament testMedicament = medicamentList.get(medicamentList.size() - 1);
        assertThat(testMedicament.getMedicament()).isEqualTo(UPDATED_MEDICAMENT);
    }

    @Test
    @Transactional
    void putNonExistingMedicament() throws Exception {
        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();
        medicament.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicamentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, medicament.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMedicament() throws Exception {
        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();
        medicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMedicament() throws Exception {
        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();
        medicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicament)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMedicamentWithPatch() throws Exception {
        // Initialize the database
        medicamentRepository.saveAndFlush(medicament);

        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();

        // Update the medicament using partial update
        Medicament partialUpdatedMedicament = new Medicament();
        partialUpdatedMedicament.setId(medicament.getId());

        restMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicament.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicament))
            )
            .andExpect(status().isOk());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
        Medicament testMedicament = medicamentList.get(medicamentList.size() - 1);
        assertThat(testMedicament.getMedicament()).isEqualTo(DEFAULT_MEDICAMENT);
    }

    @Test
    @Transactional
    void fullUpdateMedicamentWithPatch() throws Exception {
        // Initialize the database
        medicamentRepository.saveAndFlush(medicament);

        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();

        // Update the medicament using partial update
        Medicament partialUpdatedMedicament = new Medicament();
        partialUpdatedMedicament.setId(medicament.getId());

        partialUpdatedMedicament.medicament(UPDATED_MEDICAMENT);

        restMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicament.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicament))
            )
            .andExpect(status().isOk());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
        Medicament testMedicament = medicamentList.get(medicamentList.size() - 1);
        assertThat(testMedicament.getMedicament()).isEqualTo(UPDATED_MEDICAMENT);
    }

    @Test
    @Transactional
    void patchNonExistingMedicament() throws Exception {
        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();
        medicament.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, medicament.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMedicament() throws Exception {
        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();
        medicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicament))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMedicament() throws Exception {
        int databaseSizeBeforeUpdate = medicamentRepository.findAll().size();
        medicament.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(medicament))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Medicament in the database
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMedicament() throws Exception {
        // Initialize the database
        medicamentRepository.saveAndFlush(medicament);

        int databaseSizeBeforeDelete = medicamentRepository.findAll().size();

        // Delete the medicament
        restMedicamentMockMvc
            .perform(delete(ENTITY_API_URL_ID, medicament.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Medicament> medicamentList = medicamentRepository.findAll();
        assertThat(medicamentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
