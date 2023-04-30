package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Antecedent;
import com.ingstic2.myapp.repository.AntecedentRepository;
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
 * Integration tests for the {@link AntecedentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AntecedentResourceIT {

    private static final String DEFAULT_LIB_ANTECEDENT = "AAAAAAAAAA";
    private static final String UPDATED_LIB_ANTECEDENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/antecedents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AntecedentRepository antecedentRepository;

    @Mock
    private AntecedentRepository antecedentRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAntecedentMockMvc;

    private Antecedent antecedent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Antecedent createEntity(EntityManager em) {
        Antecedent antecedent = new Antecedent().libAntecedent(DEFAULT_LIB_ANTECEDENT);
        return antecedent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Antecedent createUpdatedEntity(EntityManager em) {
        Antecedent antecedent = new Antecedent().libAntecedent(UPDATED_LIB_ANTECEDENT);
        return antecedent;
    }

    @BeforeEach
    public void initTest() {
        antecedent = createEntity(em);
    }

    @Test
    @Transactional
    void createAntecedent() throws Exception {
        int databaseSizeBeforeCreate = antecedentRepository.findAll().size();
        // Create the Antecedent
        restAntecedentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antecedent)))
            .andExpect(status().isCreated());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeCreate + 1);
        Antecedent testAntecedent = antecedentList.get(antecedentList.size() - 1);
        assertThat(testAntecedent.getLibAntecedent()).isEqualTo(DEFAULT_LIB_ANTECEDENT);
    }

    @Test
    @Transactional
    void createAntecedentWithExistingId() throws Exception {
        // Create the Antecedent with an existing ID
        antecedent.setId(1L);

        int databaseSizeBeforeCreate = antecedentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAntecedentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antecedent)))
            .andExpect(status().isBadRequest());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAntecedents() throws Exception {
        // Initialize the database
        antecedentRepository.saveAndFlush(antecedent);

        // Get all the antecedentList
        restAntecedentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(antecedent.getId().intValue())))
            .andExpect(jsonPath("$.[*].libAntecedent").value(hasItem(DEFAULT_LIB_ANTECEDENT)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAntecedentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(antecedentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAntecedentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(antecedentRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAntecedentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(antecedentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAntecedentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(antecedentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAntecedent() throws Exception {
        // Initialize the database
        antecedentRepository.saveAndFlush(antecedent);

        // Get the antecedent
        restAntecedentMockMvc
            .perform(get(ENTITY_API_URL_ID, antecedent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(antecedent.getId().intValue()))
            .andExpect(jsonPath("$.libAntecedent").value(DEFAULT_LIB_ANTECEDENT));
    }

    @Test
    @Transactional
    void getNonExistingAntecedent() throws Exception {
        // Get the antecedent
        restAntecedentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAntecedent() throws Exception {
        // Initialize the database
        antecedentRepository.saveAndFlush(antecedent);

        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();

        // Update the antecedent
        Antecedent updatedAntecedent = antecedentRepository.findById(antecedent.getId()).get();
        // Disconnect from session so that the updates on updatedAntecedent are not directly saved in db
        em.detach(updatedAntecedent);
        updatedAntecedent.libAntecedent(UPDATED_LIB_ANTECEDENT);

        restAntecedentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAntecedent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAntecedent))
            )
            .andExpect(status().isOk());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
        Antecedent testAntecedent = antecedentList.get(antecedentList.size() - 1);
        assertThat(testAntecedent.getLibAntecedent()).isEqualTo(UPDATED_LIB_ANTECEDENT);
    }

    @Test
    @Transactional
    void putNonExistingAntecedent() throws Exception {
        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();
        antecedent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntecedentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, antecedent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antecedent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAntecedent() throws Exception {
        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();
        antecedent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntecedentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antecedent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAntecedent() throws Exception {
        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();
        antecedent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntecedentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antecedent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAntecedentWithPatch() throws Exception {
        // Initialize the database
        antecedentRepository.saveAndFlush(antecedent);

        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();

        // Update the antecedent using partial update
        Antecedent partialUpdatedAntecedent = new Antecedent();
        partialUpdatedAntecedent.setId(antecedent.getId());

        restAntecedentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntecedent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntecedent))
            )
            .andExpect(status().isOk());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
        Antecedent testAntecedent = antecedentList.get(antecedentList.size() - 1);
        assertThat(testAntecedent.getLibAntecedent()).isEqualTo(DEFAULT_LIB_ANTECEDENT);
    }

    @Test
    @Transactional
    void fullUpdateAntecedentWithPatch() throws Exception {
        // Initialize the database
        antecedentRepository.saveAndFlush(antecedent);

        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();

        // Update the antecedent using partial update
        Antecedent partialUpdatedAntecedent = new Antecedent();
        partialUpdatedAntecedent.setId(antecedent.getId());

        partialUpdatedAntecedent.libAntecedent(UPDATED_LIB_ANTECEDENT);

        restAntecedentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntecedent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntecedent))
            )
            .andExpect(status().isOk());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
        Antecedent testAntecedent = antecedentList.get(antecedentList.size() - 1);
        assertThat(testAntecedent.getLibAntecedent()).isEqualTo(UPDATED_LIB_ANTECEDENT);
    }

    @Test
    @Transactional
    void patchNonExistingAntecedent() throws Exception {
        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();
        antecedent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntecedentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, antecedent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antecedent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAntecedent() throws Exception {
        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();
        antecedent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntecedentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antecedent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAntecedent() throws Exception {
        int databaseSizeBeforeUpdate = antecedentRepository.findAll().size();
        antecedent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntecedentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(antecedent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Antecedent in the database
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAntecedent() throws Exception {
        // Initialize the database
        antecedentRepository.saveAndFlush(antecedent);

        int databaseSizeBeforeDelete = antecedentRepository.findAll().size();

        // Delete the antecedent
        restAntecedentMockMvc
            .perform(delete(ENTITY_API_URL_ID, antecedent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Antecedent> antecedentList = antecedentRepository.findAll();
        assertThat(antecedentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
