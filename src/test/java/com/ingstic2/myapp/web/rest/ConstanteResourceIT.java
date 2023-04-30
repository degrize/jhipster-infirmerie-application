package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Constante;
import com.ingstic2.myapp.repository.ConstanteRepository;
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
 * Integration tests for the {@link ConstanteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConstanteResourceIT {

    private static final Double DEFAULT_MASSE = 1D;
    private static final Double UPDATED_MASSE = 2D;

    private static final Double DEFAULT_TEMPERATURE = 1D;
    private static final Double UPDATED_TEMPERATURE = 2D;

    private static final Double DEFAULT_TAILLE = 1D;
    private static final Double UPDATED_TAILLE = 2D;

    private static final Integer DEFAULT_POULS = 1;
    private static final Integer UPDATED_POULS = 2;

    private static final String ENTITY_API_URL = "/api/constantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConstanteRepository constanteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConstanteMockMvc;

    private Constante constante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Constante createEntity(EntityManager em) {
        Constante constante = new Constante()
            .masse(DEFAULT_MASSE)
            .temperature(DEFAULT_TEMPERATURE)
            .taille(DEFAULT_TAILLE)
            .pouls(DEFAULT_POULS);
        return constante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Constante createUpdatedEntity(EntityManager em) {
        Constante constante = new Constante()
            .masse(UPDATED_MASSE)
            .temperature(UPDATED_TEMPERATURE)
            .taille(UPDATED_TAILLE)
            .pouls(UPDATED_POULS);
        return constante;
    }

    @BeforeEach
    public void initTest() {
        constante = createEntity(em);
    }

    @Test
    @Transactional
    void createConstante() throws Exception {
        int databaseSizeBeforeCreate = constanteRepository.findAll().size();
        // Create the Constante
        restConstanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(constante)))
            .andExpect(status().isCreated());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeCreate + 1);
        Constante testConstante = constanteList.get(constanteList.size() - 1);
        assertThat(testConstante.getMasse()).isEqualTo(DEFAULT_MASSE);
        assertThat(testConstante.getTemperature()).isEqualTo(DEFAULT_TEMPERATURE);
        assertThat(testConstante.getTaille()).isEqualTo(DEFAULT_TAILLE);
        assertThat(testConstante.getPouls()).isEqualTo(DEFAULT_POULS);
    }

    @Test
    @Transactional
    void createConstanteWithExistingId() throws Exception {
        // Create the Constante with an existing ID
        constante.setId(1L);

        int databaseSizeBeforeCreate = constanteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConstanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(constante)))
            .andExpect(status().isBadRequest());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConstantes() throws Exception {
        // Initialize the database
        constanteRepository.saveAndFlush(constante);

        // Get all the constanteList
        restConstanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(constante.getId().intValue())))
            .andExpect(jsonPath("$.[*].masse").value(hasItem(DEFAULT_MASSE.doubleValue())))
            .andExpect(jsonPath("$.[*].temperature").value(hasItem(DEFAULT_TEMPERATURE.doubleValue())))
            .andExpect(jsonPath("$.[*].taille").value(hasItem(DEFAULT_TAILLE.doubleValue())))
            .andExpect(jsonPath("$.[*].pouls").value(hasItem(DEFAULT_POULS)));
    }

    @Test
    @Transactional
    void getConstante() throws Exception {
        // Initialize the database
        constanteRepository.saveAndFlush(constante);

        // Get the constante
        restConstanteMockMvc
            .perform(get(ENTITY_API_URL_ID, constante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(constante.getId().intValue()))
            .andExpect(jsonPath("$.masse").value(DEFAULT_MASSE.doubleValue()))
            .andExpect(jsonPath("$.temperature").value(DEFAULT_TEMPERATURE.doubleValue()))
            .andExpect(jsonPath("$.taille").value(DEFAULT_TAILLE.doubleValue()))
            .andExpect(jsonPath("$.pouls").value(DEFAULT_POULS));
    }

    @Test
    @Transactional
    void getNonExistingConstante() throws Exception {
        // Get the constante
        restConstanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConstante() throws Exception {
        // Initialize the database
        constanteRepository.saveAndFlush(constante);

        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();

        // Update the constante
        Constante updatedConstante = constanteRepository.findById(constante.getId()).get();
        // Disconnect from session so that the updates on updatedConstante are not directly saved in db
        em.detach(updatedConstante);
        updatedConstante.masse(UPDATED_MASSE).temperature(UPDATED_TEMPERATURE).taille(UPDATED_TAILLE).pouls(UPDATED_POULS);

        restConstanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConstante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConstante))
            )
            .andExpect(status().isOk());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
        Constante testConstante = constanteList.get(constanteList.size() - 1);
        assertThat(testConstante.getMasse()).isEqualTo(UPDATED_MASSE);
        assertThat(testConstante.getTemperature()).isEqualTo(UPDATED_TEMPERATURE);
        assertThat(testConstante.getTaille()).isEqualTo(UPDATED_TAILLE);
        assertThat(testConstante.getPouls()).isEqualTo(UPDATED_POULS);
    }

    @Test
    @Transactional
    void putNonExistingConstante() throws Exception {
        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();
        constante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConstanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, constante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(constante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConstante() throws Exception {
        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();
        constante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConstanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(constante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConstante() throws Exception {
        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();
        constante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConstanteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(constante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConstanteWithPatch() throws Exception {
        // Initialize the database
        constanteRepository.saveAndFlush(constante);

        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();

        // Update the constante using partial update
        Constante partialUpdatedConstante = new Constante();
        partialUpdatedConstante.setId(constante.getId());

        restConstanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConstante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConstante))
            )
            .andExpect(status().isOk());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
        Constante testConstante = constanteList.get(constanteList.size() - 1);
        assertThat(testConstante.getMasse()).isEqualTo(DEFAULT_MASSE);
        assertThat(testConstante.getTemperature()).isEqualTo(DEFAULT_TEMPERATURE);
        assertThat(testConstante.getTaille()).isEqualTo(DEFAULT_TAILLE);
        assertThat(testConstante.getPouls()).isEqualTo(DEFAULT_POULS);
    }

    @Test
    @Transactional
    void fullUpdateConstanteWithPatch() throws Exception {
        // Initialize the database
        constanteRepository.saveAndFlush(constante);

        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();

        // Update the constante using partial update
        Constante partialUpdatedConstante = new Constante();
        partialUpdatedConstante.setId(constante.getId());

        partialUpdatedConstante.masse(UPDATED_MASSE).temperature(UPDATED_TEMPERATURE).taille(UPDATED_TAILLE).pouls(UPDATED_POULS);

        restConstanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConstante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConstante))
            )
            .andExpect(status().isOk());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
        Constante testConstante = constanteList.get(constanteList.size() - 1);
        assertThat(testConstante.getMasse()).isEqualTo(UPDATED_MASSE);
        assertThat(testConstante.getTemperature()).isEqualTo(UPDATED_TEMPERATURE);
        assertThat(testConstante.getTaille()).isEqualTo(UPDATED_TAILLE);
        assertThat(testConstante.getPouls()).isEqualTo(UPDATED_POULS);
    }

    @Test
    @Transactional
    void patchNonExistingConstante() throws Exception {
        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();
        constante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConstanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, constante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(constante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConstante() throws Exception {
        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();
        constante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConstanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(constante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConstante() throws Exception {
        int databaseSizeBeforeUpdate = constanteRepository.findAll().size();
        constante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConstanteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(constante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Constante in the database
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConstante() throws Exception {
        // Initialize the database
        constanteRepository.saveAndFlush(constante);

        int databaseSizeBeforeDelete = constanteRepository.findAll().size();

        // Delete the constante
        restConstanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, constante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Constante> constanteList = constanteRepository.findAll();
        assertThat(constanteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
