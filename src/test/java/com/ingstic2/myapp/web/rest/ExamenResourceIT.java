package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Examen;
import com.ingstic2.myapp.repository.ExamenRepository;
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
 * Integration tests for the {@link ExamenResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ExamenResourceIT {

    private static final String DEFAULT_EXAMEN_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_EXAMEN_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/examen";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExamenRepository examenRepository;

    @Mock
    private ExamenRepository examenRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExamenMockMvc;

    private Examen examen;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Examen createEntity(EntityManager em) {
        Examen examen = new Examen().examenLibelle(DEFAULT_EXAMEN_LIBELLE);
        return examen;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Examen createUpdatedEntity(EntityManager em) {
        Examen examen = new Examen().examenLibelle(UPDATED_EXAMEN_LIBELLE);
        return examen;
    }

    @BeforeEach
    public void initTest() {
        examen = createEntity(em);
    }

    @Test
    @Transactional
    void createExamen() throws Exception {
        int databaseSizeBeforeCreate = examenRepository.findAll().size();
        // Create the Examen
        restExamenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isCreated());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeCreate + 1);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getExamenLibelle()).isEqualTo(DEFAULT_EXAMEN_LIBELLE);
    }

    @Test
    @Transactional
    void createExamenWithExistingId() throws Exception {
        // Create the Examen with an existing ID
        examen.setId(1L);

        int databaseSizeBeforeCreate = examenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExamenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        // Get all the examenList
        restExamenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(examen.getId().intValue())))
            .andExpect(jsonPath("$.[*].examenLibelle").value(hasItem(DEFAULT_EXAMEN_LIBELLE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExamenWithEagerRelationshipsIsEnabled() throws Exception {
        when(examenRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExamenMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(examenRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExamenWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(examenRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExamenMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(examenRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        // Get the examen
        restExamenMockMvc
            .perform(get(ENTITY_API_URL_ID, examen.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(examen.getId().intValue()))
            .andExpect(jsonPath("$.examenLibelle").value(DEFAULT_EXAMEN_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingExamen() throws Exception {
        // Get the examen
        restExamenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeUpdate = examenRepository.findAll().size();

        // Update the examen
        Examen updatedExamen = examenRepository.findById(examen.getId()).get();
        // Disconnect from session so that the updates on updatedExamen are not directly saved in db
        em.detach(updatedExamen);
        updatedExamen.examenLibelle(UPDATED_EXAMEN_LIBELLE);

        restExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExamen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExamen))
            )
            .andExpect(status().isOk());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getExamenLibelle()).isEqualTo(UPDATED_EXAMEN_LIBELLE);
    }

    @Test
    @Transactional
    void putNonExistingExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, examen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExamenWithPatch() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeUpdate = examenRepository.findAll().size();

        // Update the examen using partial update
        Examen partialUpdatedExamen = new Examen();
        partialUpdatedExamen.setId(examen.getId());

        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExamen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExamen))
            )
            .andExpect(status().isOk());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getExamenLibelle()).isEqualTo(DEFAULT_EXAMEN_LIBELLE);
    }

    @Test
    @Transactional
    void fullUpdateExamenWithPatch() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeUpdate = examenRepository.findAll().size();

        // Update the examen using partial update
        Examen partialUpdatedExamen = new Examen();
        partialUpdatedExamen.setId(examen.getId());

        partialUpdatedExamen.examenLibelle(UPDATED_EXAMEN_LIBELLE);

        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExamen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExamen))
            )
            .andExpect(status().isOk());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getExamenLibelle()).isEqualTo(UPDATED_EXAMEN_LIBELLE);
    }

    @Test
    @Transactional
    void patchNonExistingExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, examen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeDelete = examenRepository.findAll().size();

        // Delete the examen
        restExamenMockMvc
            .perform(delete(ENTITY_API_URL_ID, examen.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
