package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Rdv;
import com.ingstic2.myapp.repository.RdvRepository;
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
 * Integration tests for the {@link RdvResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RdvResourceIT {

    private static final LocalDate DEFAULT_DATE_RDV = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_RDV = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_MOTIF = "AAAAAAAAAA";
    private static final String UPDATED_MOTIF = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rdvs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RdvRepository rdvRepository;

    @Mock
    private RdvRepository rdvRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRdvMockMvc;

    private Rdv rdv;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rdv createEntity(EntityManager em) {
        Rdv rdv = new Rdv().dateRdv(DEFAULT_DATE_RDV).motif(DEFAULT_MOTIF);
        return rdv;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rdv createUpdatedEntity(EntityManager em) {
        Rdv rdv = new Rdv().dateRdv(UPDATED_DATE_RDV).motif(UPDATED_MOTIF);
        return rdv;
    }

    @BeforeEach
    public void initTest() {
        rdv = createEntity(em);
    }

    @Test
    @Transactional
    void createRdv() throws Exception {
        int databaseSizeBeforeCreate = rdvRepository.findAll().size();
        // Create the Rdv
        restRdvMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rdv)))
            .andExpect(status().isCreated());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeCreate + 1);
        Rdv testRdv = rdvList.get(rdvList.size() - 1);
        assertThat(testRdv.getDateRdv()).isEqualTo(DEFAULT_DATE_RDV);
        assertThat(testRdv.getMotif()).isEqualTo(DEFAULT_MOTIF);
    }

    @Test
    @Transactional
    void createRdvWithExistingId() throws Exception {
        // Create the Rdv with an existing ID
        rdv.setId(1L);

        int databaseSizeBeforeCreate = rdvRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRdvMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rdv)))
            .andExpect(status().isBadRequest());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRdvs() throws Exception {
        // Initialize the database
        rdvRepository.saveAndFlush(rdv);

        // Get all the rdvList
        restRdvMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rdv.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateRdv").value(hasItem(DEFAULT_DATE_RDV.toString())))
            .andExpect(jsonPath("$.[*].motif").value(hasItem(DEFAULT_MOTIF)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRdvsWithEagerRelationshipsIsEnabled() throws Exception {
        when(rdvRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRdvMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(rdvRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRdvsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(rdvRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRdvMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(rdvRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getRdv() throws Exception {
        // Initialize the database
        rdvRepository.saveAndFlush(rdv);

        // Get the rdv
        restRdvMockMvc
            .perform(get(ENTITY_API_URL_ID, rdv.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rdv.getId().intValue()))
            .andExpect(jsonPath("$.dateRdv").value(DEFAULT_DATE_RDV.toString()))
            .andExpect(jsonPath("$.motif").value(DEFAULT_MOTIF));
    }

    @Test
    @Transactional
    void getNonExistingRdv() throws Exception {
        // Get the rdv
        restRdvMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRdv() throws Exception {
        // Initialize the database
        rdvRepository.saveAndFlush(rdv);

        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();

        // Update the rdv
        Rdv updatedRdv = rdvRepository.findById(rdv.getId()).get();
        // Disconnect from session so that the updates on updatedRdv are not directly saved in db
        em.detach(updatedRdv);
        updatedRdv.dateRdv(UPDATED_DATE_RDV).motif(UPDATED_MOTIF);

        restRdvMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRdv.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRdv))
            )
            .andExpect(status().isOk());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
        Rdv testRdv = rdvList.get(rdvList.size() - 1);
        assertThat(testRdv.getDateRdv()).isEqualTo(UPDATED_DATE_RDV);
        assertThat(testRdv.getMotif()).isEqualTo(UPDATED_MOTIF);
    }

    @Test
    @Transactional
    void putNonExistingRdv() throws Exception {
        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();
        rdv.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRdvMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rdv.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rdv))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRdv() throws Exception {
        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();
        rdv.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRdvMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rdv))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRdv() throws Exception {
        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();
        rdv.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRdvMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rdv)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRdvWithPatch() throws Exception {
        // Initialize the database
        rdvRepository.saveAndFlush(rdv);

        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();

        // Update the rdv using partial update
        Rdv partialUpdatedRdv = new Rdv();
        partialUpdatedRdv.setId(rdv.getId());

        partialUpdatedRdv.motif(UPDATED_MOTIF);

        restRdvMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRdv.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRdv))
            )
            .andExpect(status().isOk());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
        Rdv testRdv = rdvList.get(rdvList.size() - 1);
        assertThat(testRdv.getDateRdv()).isEqualTo(DEFAULT_DATE_RDV);
        assertThat(testRdv.getMotif()).isEqualTo(UPDATED_MOTIF);
    }

    @Test
    @Transactional
    void fullUpdateRdvWithPatch() throws Exception {
        // Initialize the database
        rdvRepository.saveAndFlush(rdv);

        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();

        // Update the rdv using partial update
        Rdv partialUpdatedRdv = new Rdv();
        partialUpdatedRdv.setId(rdv.getId());

        partialUpdatedRdv.dateRdv(UPDATED_DATE_RDV).motif(UPDATED_MOTIF);

        restRdvMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRdv.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRdv))
            )
            .andExpect(status().isOk());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
        Rdv testRdv = rdvList.get(rdvList.size() - 1);
        assertThat(testRdv.getDateRdv()).isEqualTo(UPDATED_DATE_RDV);
        assertThat(testRdv.getMotif()).isEqualTo(UPDATED_MOTIF);
    }

    @Test
    @Transactional
    void patchNonExistingRdv() throws Exception {
        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();
        rdv.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRdvMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rdv.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rdv))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRdv() throws Exception {
        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();
        rdv.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRdvMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rdv))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRdv() throws Exception {
        int databaseSizeBeforeUpdate = rdvRepository.findAll().size();
        rdv.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRdvMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rdv)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rdv in the database
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRdv() throws Exception {
        // Initialize the database
        rdvRepository.saveAndFlush(rdv);

        int databaseSizeBeforeDelete = rdvRepository.findAll().size();

        // Delete the rdv
        restRdvMockMvc.perform(delete(ENTITY_API_URL_ID, rdv.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Rdv> rdvList = rdvRepository.findAll();
        assertThat(rdvList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
