package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Pathologie;
import com.ingstic2.myapp.repository.PathologieRepository;
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
 * Integration tests for the {@link PathologieResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PathologieResourceIT {

    private static final String DEFAULT_LIBELLE_PATHOLOGIE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE_PATHOLOGIE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/pathologies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PathologieRepository pathologieRepository;

    @Mock
    private PathologieRepository pathologieRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPathologieMockMvc;

    private Pathologie pathologie;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pathologie createEntity(EntityManager em) {
        Pathologie pathologie = new Pathologie().libellePathologie(DEFAULT_LIBELLE_PATHOLOGIE);
        return pathologie;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pathologie createUpdatedEntity(EntityManager em) {
        Pathologie pathologie = new Pathologie().libellePathologie(UPDATED_LIBELLE_PATHOLOGIE);
        return pathologie;
    }

    @BeforeEach
    public void initTest() {
        pathologie = createEntity(em);
    }

    @Test
    @Transactional
    void createPathologie() throws Exception {
        int databaseSizeBeforeCreate = pathologieRepository.findAll().size();
        // Create the Pathologie
        restPathologieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pathologie)))
            .andExpect(status().isCreated());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeCreate + 1);
        Pathologie testPathologie = pathologieList.get(pathologieList.size() - 1);
        assertThat(testPathologie.getLibellePathologie()).isEqualTo(DEFAULT_LIBELLE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void createPathologieWithExistingId() throws Exception {
        // Create the Pathologie with an existing ID
        pathologie.setId(1L);

        int databaseSizeBeforeCreate = pathologieRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPathologieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pathologie)))
            .andExpect(status().isBadRequest());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPathologies() throws Exception {
        // Initialize the database
        pathologieRepository.saveAndFlush(pathologie);

        // Get all the pathologieList
        restPathologieMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pathologie.getId().intValue())))
            .andExpect(jsonPath("$.[*].libellePathologie").value(hasItem(DEFAULT_LIBELLE_PATHOLOGIE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPathologiesWithEagerRelationshipsIsEnabled() throws Exception {
        when(pathologieRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPathologieMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(pathologieRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPathologiesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(pathologieRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPathologieMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(pathologieRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPathologie() throws Exception {
        // Initialize the database
        pathologieRepository.saveAndFlush(pathologie);

        // Get the pathologie
        restPathologieMockMvc
            .perform(get(ENTITY_API_URL_ID, pathologie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pathologie.getId().intValue()))
            .andExpect(jsonPath("$.libellePathologie").value(DEFAULT_LIBELLE_PATHOLOGIE));
    }

    @Test
    @Transactional
    void getNonExistingPathologie() throws Exception {
        // Get the pathologie
        restPathologieMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPathologie() throws Exception {
        // Initialize the database
        pathologieRepository.saveAndFlush(pathologie);

        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();

        // Update the pathologie
        Pathologie updatedPathologie = pathologieRepository.findById(pathologie.getId()).get();
        // Disconnect from session so that the updates on updatedPathologie are not directly saved in db
        em.detach(updatedPathologie);
        updatedPathologie.libellePathologie(UPDATED_LIBELLE_PATHOLOGIE);

        restPathologieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPathologie.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPathologie))
            )
            .andExpect(status().isOk());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
        Pathologie testPathologie = pathologieList.get(pathologieList.size() - 1);
        assertThat(testPathologie.getLibellePathologie()).isEqualTo(UPDATED_LIBELLE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void putNonExistingPathologie() throws Exception {
        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();
        pathologie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPathologieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pathologie.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPathologie() throws Exception {
        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();
        pathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPathologieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPathologie() throws Exception {
        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();
        pathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPathologieMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pathologie)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePathologieWithPatch() throws Exception {
        // Initialize the database
        pathologieRepository.saveAndFlush(pathologie);

        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();

        // Update the pathologie using partial update
        Pathologie partialUpdatedPathologie = new Pathologie();
        partialUpdatedPathologie.setId(pathologie.getId());

        partialUpdatedPathologie.libellePathologie(UPDATED_LIBELLE_PATHOLOGIE);

        restPathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPathologie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPathologie))
            )
            .andExpect(status().isOk());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
        Pathologie testPathologie = pathologieList.get(pathologieList.size() - 1);
        assertThat(testPathologie.getLibellePathologie()).isEqualTo(UPDATED_LIBELLE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void fullUpdatePathologieWithPatch() throws Exception {
        // Initialize the database
        pathologieRepository.saveAndFlush(pathologie);

        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();

        // Update the pathologie using partial update
        Pathologie partialUpdatedPathologie = new Pathologie();
        partialUpdatedPathologie.setId(pathologie.getId());

        partialUpdatedPathologie.libellePathologie(UPDATED_LIBELLE_PATHOLOGIE);

        restPathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPathologie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPathologie))
            )
            .andExpect(status().isOk());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
        Pathologie testPathologie = pathologieList.get(pathologieList.size() - 1);
        assertThat(testPathologie.getLibellePathologie()).isEqualTo(UPDATED_LIBELLE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void patchNonExistingPathologie() throws Exception {
        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();
        pathologie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pathologie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPathologie() throws Exception {
        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();
        pathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPathologie() throws Exception {
        int databaseSizeBeforeUpdate = pathologieRepository.findAll().size();
        pathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPathologieMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pathologie))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pathologie in the database
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePathologie() throws Exception {
        // Initialize the database
        pathologieRepository.saveAndFlush(pathologie);

        int databaseSizeBeforeDelete = pathologieRepository.findAll().size();

        // Delete the pathologie
        restPathologieMockMvc
            .perform(delete(ENTITY_API_URL_ID, pathologie.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pathologie> pathologieList = pathologieRepository.findAll();
        assertThat(pathologieList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
