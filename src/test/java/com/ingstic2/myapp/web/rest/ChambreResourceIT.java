package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Chambre;
import com.ingstic2.myapp.repository.ChambreRepository;
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
 * Integration tests for the {@link ChambreResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ChambreResourceIT {

    private static final Integer DEFAULT_NUMERO_CHAMBRE = 1;
    private static final Integer UPDATED_NUMERO_CHAMBRE = 2;

    private static final String ENTITY_API_URL = "/api/chambres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChambreRepository chambreRepository;

    @Mock
    private ChambreRepository chambreRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChambreMockMvc;

    private Chambre chambre;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chambre createEntity(EntityManager em) {
        Chambre chambre = new Chambre().numeroChambre(DEFAULT_NUMERO_CHAMBRE);
        return chambre;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chambre createUpdatedEntity(EntityManager em) {
        Chambre chambre = new Chambre().numeroChambre(UPDATED_NUMERO_CHAMBRE);
        return chambre;
    }

    @BeforeEach
    public void initTest() {
        chambre = createEntity(em);
    }

    @Test
    @Transactional
    void createChambre() throws Exception {
        int databaseSizeBeforeCreate = chambreRepository.findAll().size();
        // Create the Chambre
        restChambreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chambre)))
            .andExpect(status().isCreated());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeCreate + 1);
        Chambre testChambre = chambreList.get(chambreList.size() - 1);
        assertThat(testChambre.getNumeroChambre()).isEqualTo(DEFAULT_NUMERO_CHAMBRE);
    }

    @Test
    @Transactional
    void createChambreWithExistingId() throws Exception {
        // Create the Chambre with an existing ID
        chambre.setId(1L);

        int databaseSizeBeforeCreate = chambreRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChambreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chambre)))
            .andExpect(status().isBadRequest());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChambres() throws Exception {
        // Initialize the database
        chambreRepository.saveAndFlush(chambre);

        // Get all the chambreList
        restChambreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chambre.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroChambre").value(hasItem(DEFAULT_NUMERO_CHAMBRE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChambresWithEagerRelationshipsIsEnabled() throws Exception {
        when(chambreRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChambreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(chambreRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChambresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(chambreRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChambreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(chambreRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getChambre() throws Exception {
        // Initialize the database
        chambreRepository.saveAndFlush(chambre);

        // Get the chambre
        restChambreMockMvc
            .perform(get(ENTITY_API_URL_ID, chambre.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chambre.getId().intValue()))
            .andExpect(jsonPath("$.numeroChambre").value(DEFAULT_NUMERO_CHAMBRE));
    }

    @Test
    @Transactional
    void getNonExistingChambre() throws Exception {
        // Get the chambre
        restChambreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChambre() throws Exception {
        // Initialize the database
        chambreRepository.saveAndFlush(chambre);

        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();

        // Update the chambre
        Chambre updatedChambre = chambreRepository.findById(chambre.getId()).get();
        // Disconnect from session so that the updates on updatedChambre are not directly saved in db
        em.detach(updatedChambre);
        updatedChambre.numeroChambre(UPDATED_NUMERO_CHAMBRE);

        restChambreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChambre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChambre))
            )
            .andExpect(status().isOk());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
        Chambre testChambre = chambreList.get(chambreList.size() - 1);
        assertThat(testChambre.getNumeroChambre()).isEqualTo(UPDATED_NUMERO_CHAMBRE);
    }

    @Test
    @Transactional
    void putNonExistingChambre() throws Exception {
        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();
        chambre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChambreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chambre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chambre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChambre() throws Exception {
        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();
        chambre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chambre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChambre() throws Exception {
        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();
        chambre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chambre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChambreWithPatch() throws Exception {
        // Initialize the database
        chambreRepository.saveAndFlush(chambre);

        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();

        // Update the chambre using partial update
        Chambre partialUpdatedChambre = new Chambre();
        partialUpdatedChambre.setId(chambre.getId());

        restChambreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChambre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChambre))
            )
            .andExpect(status().isOk());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
        Chambre testChambre = chambreList.get(chambreList.size() - 1);
        assertThat(testChambre.getNumeroChambre()).isEqualTo(DEFAULT_NUMERO_CHAMBRE);
    }

    @Test
    @Transactional
    void fullUpdateChambreWithPatch() throws Exception {
        // Initialize the database
        chambreRepository.saveAndFlush(chambre);

        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();

        // Update the chambre using partial update
        Chambre partialUpdatedChambre = new Chambre();
        partialUpdatedChambre.setId(chambre.getId());

        partialUpdatedChambre.numeroChambre(UPDATED_NUMERO_CHAMBRE);

        restChambreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChambre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChambre))
            )
            .andExpect(status().isOk());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
        Chambre testChambre = chambreList.get(chambreList.size() - 1);
        assertThat(testChambre.getNumeroChambre()).isEqualTo(UPDATED_NUMERO_CHAMBRE);
    }

    @Test
    @Transactional
    void patchNonExistingChambre() throws Exception {
        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();
        chambre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChambreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chambre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chambre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChambre() throws Exception {
        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();
        chambre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chambre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChambre() throws Exception {
        int databaseSizeBeforeUpdate = chambreRepository.findAll().size();
        chambre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambreMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chambre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chambre in the database
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChambre() throws Exception {
        // Initialize the database
        chambreRepository.saveAndFlush(chambre);

        int databaseSizeBeforeDelete = chambreRepository.findAll().size();

        // Delete the chambre
        restChambreMockMvc
            .perform(delete(ENTITY_API_URL_ID, chambre.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chambre> chambreList = chambreRepository.findAll();
        assertThat(chambreList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
