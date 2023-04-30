package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.CentreSante;
import com.ingstic2.myapp.repository.CentreSanteRepository;
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
 * Integration tests for the {@link CentreSanteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CentreSanteResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_MATRICULATION = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_MATRICULATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/centre-santes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CentreSanteRepository centreSanteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCentreSanteMockMvc;

    private CentreSante centreSante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CentreSante createEntity(EntityManager em) {
        CentreSante centreSante = new CentreSante()
            .nom(DEFAULT_NOM)
            .adresse(DEFAULT_ADRESSE)
            .contact(DEFAULT_CONTACT)
            .email(DEFAULT_EMAIL)
            .numeroMatriculation(DEFAULT_NUMERO_MATRICULATION);
        return centreSante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CentreSante createUpdatedEntity(EntityManager em) {
        CentreSante centreSante = new CentreSante()
            .nom(UPDATED_NOM)
            .adresse(UPDATED_ADRESSE)
            .contact(UPDATED_CONTACT)
            .email(UPDATED_EMAIL)
            .numeroMatriculation(UPDATED_NUMERO_MATRICULATION);
        return centreSante;
    }

    @BeforeEach
    public void initTest() {
        centreSante = createEntity(em);
    }

    @Test
    @Transactional
    void createCentreSante() throws Exception {
        int databaseSizeBeforeCreate = centreSanteRepository.findAll().size();
        // Create the CentreSante
        restCentreSanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(centreSante)))
            .andExpect(status().isCreated());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeCreate + 1);
        CentreSante testCentreSante = centreSanteList.get(centreSanteList.size() - 1);
        assertThat(testCentreSante.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCentreSante.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testCentreSante.getContact()).isEqualTo(DEFAULT_CONTACT);
        assertThat(testCentreSante.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testCentreSante.getNumeroMatriculation()).isEqualTo(DEFAULT_NUMERO_MATRICULATION);
    }

    @Test
    @Transactional
    void createCentreSanteWithExistingId() throws Exception {
        // Create the CentreSante with an existing ID
        centreSante.setId(1L);

        int databaseSizeBeforeCreate = centreSanteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCentreSanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(centreSante)))
            .andExpect(status().isBadRequest());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCentreSantes() throws Exception {
        // Initialize the database
        centreSanteRepository.saveAndFlush(centreSante);

        // Get all the centreSanteList
        restCentreSanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(centreSante.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].numeroMatriculation").value(hasItem(DEFAULT_NUMERO_MATRICULATION)));
    }

    @Test
    @Transactional
    void getCentreSante() throws Exception {
        // Initialize the database
        centreSanteRepository.saveAndFlush(centreSante);

        // Get the centreSante
        restCentreSanteMockMvc
            .perform(get(ENTITY_API_URL_ID, centreSante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(centreSante.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.numeroMatriculation").value(DEFAULT_NUMERO_MATRICULATION));
    }

    @Test
    @Transactional
    void getNonExistingCentreSante() throws Exception {
        // Get the centreSante
        restCentreSanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCentreSante() throws Exception {
        // Initialize the database
        centreSanteRepository.saveAndFlush(centreSante);

        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();

        // Update the centreSante
        CentreSante updatedCentreSante = centreSanteRepository.findById(centreSante.getId()).get();
        // Disconnect from session so that the updates on updatedCentreSante are not directly saved in db
        em.detach(updatedCentreSante);
        updatedCentreSante
            .nom(UPDATED_NOM)
            .adresse(UPDATED_ADRESSE)
            .contact(UPDATED_CONTACT)
            .email(UPDATED_EMAIL)
            .numeroMatriculation(UPDATED_NUMERO_MATRICULATION);

        restCentreSanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCentreSante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCentreSante))
            )
            .andExpect(status().isOk());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
        CentreSante testCentreSante = centreSanteList.get(centreSanteList.size() - 1);
        assertThat(testCentreSante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCentreSante.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testCentreSante.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testCentreSante.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testCentreSante.getNumeroMatriculation()).isEqualTo(UPDATED_NUMERO_MATRICULATION);
    }

    @Test
    @Transactional
    void putNonExistingCentreSante() throws Exception {
        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();
        centreSante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCentreSanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, centreSante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(centreSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCentreSante() throws Exception {
        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();
        centreSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentreSanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(centreSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCentreSante() throws Exception {
        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();
        centreSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentreSanteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(centreSante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCentreSanteWithPatch() throws Exception {
        // Initialize the database
        centreSanteRepository.saveAndFlush(centreSante);

        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();

        // Update the centreSante using partial update
        CentreSante partialUpdatedCentreSante = new CentreSante();
        partialUpdatedCentreSante.setId(centreSante.getId());

        partialUpdatedCentreSante.nom(UPDATED_NOM).numeroMatriculation(UPDATED_NUMERO_MATRICULATION);

        restCentreSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCentreSante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCentreSante))
            )
            .andExpect(status().isOk());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
        CentreSante testCentreSante = centreSanteList.get(centreSanteList.size() - 1);
        assertThat(testCentreSante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCentreSante.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testCentreSante.getContact()).isEqualTo(DEFAULT_CONTACT);
        assertThat(testCentreSante.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testCentreSante.getNumeroMatriculation()).isEqualTo(UPDATED_NUMERO_MATRICULATION);
    }

    @Test
    @Transactional
    void fullUpdateCentreSanteWithPatch() throws Exception {
        // Initialize the database
        centreSanteRepository.saveAndFlush(centreSante);

        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();

        // Update the centreSante using partial update
        CentreSante partialUpdatedCentreSante = new CentreSante();
        partialUpdatedCentreSante.setId(centreSante.getId());

        partialUpdatedCentreSante
            .nom(UPDATED_NOM)
            .adresse(UPDATED_ADRESSE)
            .contact(UPDATED_CONTACT)
            .email(UPDATED_EMAIL)
            .numeroMatriculation(UPDATED_NUMERO_MATRICULATION);

        restCentreSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCentreSante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCentreSante))
            )
            .andExpect(status().isOk());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
        CentreSante testCentreSante = centreSanteList.get(centreSanteList.size() - 1);
        assertThat(testCentreSante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCentreSante.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testCentreSante.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testCentreSante.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testCentreSante.getNumeroMatriculation()).isEqualTo(UPDATED_NUMERO_MATRICULATION);
    }

    @Test
    @Transactional
    void patchNonExistingCentreSante() throws Exception {
        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();
        centreSante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCentreSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, centreSante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(centreSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCentreSante() throws Exception {
        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();
        centreSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentreSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(centreSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCentreSante() throws Exception {
        int databaseSizeBeforeUpdate = centreSanteRepository.findAll().size();
        centreSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentreSanteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(centreSante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CentreSante in the database
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCentreSante() throws Exception {
        // Initialize the database
        centreSanteRepository.saveAndFlush(centreSante);

        int databaseSizeBeforeDelete = centreSanteRepository.findAll().size();

        // Delete the centreSante
        restCentreSanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, centreSante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CentreSante> centreSanteList = centreSanteRepository.findAll();
        assertThat(centreSanteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
