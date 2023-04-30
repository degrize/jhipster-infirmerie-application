package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Filiere;
import com.ingstic2.myapp.domain.enumeration.Cycle;
import com.ingstic2.myapp.repository.FiliereRepository;
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
 * Integration tests for the {@link FiliereResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FiliereResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Cycle DEFAULT_CYCLE = Cycle.PREPA;
    private static final Cycle UPDATED_CYCLE = Cycle.TS;

    private static final String ENTITY_API_URL = "/api/filieres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FiliereRepository filiereRepository;

    @Mock
    private FiliereRepository filiereRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFiliereMockMvc;

    private Filiere filiere;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Filiere createEntity(EntityManager em) {
        Filiere filiere = new Filiere().nom(DEFAULT_NOM).cycle(DEFAULT_CYCLE);
        return filiere;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Filiere createUpdatedEntity(EntityManager em) {
        Filiere filiere = new Filiere().nom(UPDATED_NOM).cycle(UPDATED_CYCLE);
        return filiere;
    }

    @BeforeEach
    public void initTest() {
        filiere = createEntity(em);
    }

    @Test
    @Transactional
    void createFiliere() throws Exception {
        int databaseSizeBeforeCreate = filiereRepository.findAll().size();
        // Create the Filiere
        restFiliereMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filiere)))
            .andExpect(status().isCreated());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeCreate + 1);
        Filiere testFiliere = filiereList.get(filiereList.size() - 1);
        assertThat(testFiliere.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testFiliere.getCycle()).isEqualTo(DEFAULT_CYCLE);
    }

    @Test
    @Transactional
    void createFiliereWithExistingId() throws Exception {
        // Create the Filiere with an existing ID
        filiere.setId(1L);

        int databaseSizeBeforeCreate = filiereRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFiliereMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filiere)))
            .andExpect(status().isBadRequest());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFilieres() throws Exception {
        // Initialize the database
        filiereRepository.saveAndFlush(filiere);

        // Get all the filiereList
        restFiliereMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(filiere.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].cycle").value(hasItem(DEFAULT_CYCLE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFilieresWithEagerRelationshipsIsEnabled() throws Exception {
        when(filiereRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFiliereMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(filiereRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFilieresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(filiereRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFiliereMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(filiereRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getFiliere() throws Exception {
        // Initialize the database
        filiereRepository.saveAndFlush(filiere);

        // Get the filiere
        restFiliereMockMvc
            .perform(get(ENTITY_API_URL_ID, filiere.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(filiere.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.cycle").value(DEFAULT_CYCLE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFiliere() throws Exception {
        // Get the filiere
        restFiliereMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFiliere() throws Exception {
        // Initialize the database
        filiereRepository.saveAndFlush(filiere);

        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();

        // Update the filiere
        Filiere updatedFiliere = filiereRepository.findById(filiere.getId()).get();
        // Disconnect from session so that the updates on updatedFiliere are not directly saved in db
        em.detach(updatedFiliere);
        updatedFiliere.nom(UPDATED_NOM).cycle(UPDATED_CYCLE);

        restFiliereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFiliere.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFiliere))
            )
            .andExpect(status().isOk());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
        Filiere testFiliere = filiereList.get(filiereList.size() - 1);
        assertThat(testFiliere.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFiliere.getCycle()).isEqualTo(UPDATED_CYCLE);
    }

    @Test
    @Transactional
    void putNonExistingFiliere() throws Exception {
        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();
        filiere.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFiliereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, filiere.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(filiere))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFiliere() throws Exception {
        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();
        filiere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFiliereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(filiere))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFiliere() throws Exception {
        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();
        filiere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFiliereMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filiere)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFiliereWithPatch() throws Exception {
        // Initialize the database
        filiereRepository.saveAndFlush(filiere);

        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();

        // Update the filiere using partial update
        Filiere partialUpdatedFiliere = new Filiere();
        partialUpdatedFiliere.setId(filiere.getId());

        partialUpdatedFiliere.nom(UPDATED_NOM).cycle(UPDATED_CYCLE);

        restFiliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFiliere.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFiliere))
            )
            .andExpect(status().isOk());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
        Filiere testFiliere = filiereList.get(filiereList.size() - 1);
        assertThat(testFiliere.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFiliere.getCycle()).isEqualTo(UPDATED_CYCLE);
    }

    @Test
    @Transactional
    void fullUpdateFiliereWithPatch() throws Exception {
        // Initialize the database
        filiereRepository.saveAndFlush(filiere);

        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();

        // Update the filiere using partial update
        Filiere partialUpdatedFiliere = new Filiere();
        partialUpdatedFiliere.setId(filiere.getId());

        partialUpdatedFiliere.nom(UPDATED_NOM).cycle(UPDATED_CYCLE);

        restFiliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFiliere.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFiliere))
            )
            .andExpect(status().isOk());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
        Filiere testFiliere = filiereList.get(filiereList.size() - 1);
        assertThat(testFiliere.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFiliere.getCycle()).isEqualTo(UPDATED_CYCLE);
    }

    @Test
    @Transactional
    void patchNonExistingFiliere() throws Exception {
        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();
        filiere.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFiliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, filiere.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(filiere))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFiliere() throws Exception {
        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();
        filiere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFiliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(filiere))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFiliere() throws Exception {
        int databaseSizeBeforeUpdate = filiereRepository.findAll().size();
        filiere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFiliereMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(filiere)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Filiere in the database
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFiliere() throws Exception {
        // Initialize the database
        filiereRepository.saveAndFlush(filiere);

        int databaseSizeBeforeDelete = filiereRepository.findAll().size();

        // Delete the filiere
        restFiliereMockMvc
            .perform(delete(ENTITY_API_URL_ID, filiere.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Filiere> filiereList = filiereRepository.findAll();
        assertThat(filiereList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
