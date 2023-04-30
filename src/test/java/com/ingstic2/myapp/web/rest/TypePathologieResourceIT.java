package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.TypePathologie;
import com.ingstic2.myapp.repository.TypePathologieRepository;
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
 * Integration tests for the {@link TypePathologieResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypePathologieResourceIT {

    private static final String DEFAULT_TYPE_PATHOLOGIE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_PATHOLOGIE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-pathologies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypePathologieRepository typePathologieRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypePathologieMockMvc;

    private TypePathologie typePathologie;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypePathologie createEntity(EntityManager em) {
        TypePathologie typePathologie = new TypePathologie().typePathologie(DEFAULT_TYPE_PATHOLOGIE);
        return typePathologie;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypePathologie createUpdatedEntity(EntityManager em) {
        TypePathologie typePathologie = new TypePathologie().typePathologie(UPDATED_TYPE_PATHOLOGIE);
        return typePathologie;
    }

    @BeforeEach
    public void initTest() {
        typePathologie = createEntity(em);
    }

    @Test
    @Transactional
    void createTypePathologie() throws Exception {
        int databaseSizeBeforeCreate = typePathologieRepository.findAll().size();
        // Create the TypePathologie
        restTypePathologieMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typePathologie))
            )
            .andExpect(status().isCreated());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeCreate + 1);
        TypePathologie testTypePathologie = typePathologieList.get(typePathologieList.size() - 1);
        assertThat(testTypePathologie.getTypePathologie()).isEqualTo(DEFAULT_TYPE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void createTypePathologieWithExistingId() throws Exception {
        // Create the TypePathologie with an existing ID
        typePathologie.setId(1L);

        int databaseSizeBeforeCreate = typePathologieRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypePathologieMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typePathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypePathologies() throws Exception {
        // Initialize the database
        typePathologieRepository.saveAndFlush(typePathologie);

        // Get all the typePathologieList
        restTypePathologieMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typePathologie.getId().intValue())))
            .andExpect(jsonPath("$.[*].typePathologie").value(hasItem(DEFAULT_TYPE_PATHOLOGIE)));
    }

    @Test
    @Transactional
    void getTypePathologie() throws Exception {
        // Initialize the database
        typePathologieRepository.saveAndFlush(typePathologie);

        // Get the typePathologie
        restTypePathologieMockMvc
            .perform(get(ENTITY_API_URL_ID, typePathologie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typePathologie.getId().intValue()))
            .andExpect(jsonPath("$.typePathologie").value(DEFAULT_TYPE_PATHOLOGIE));
    }

    @Test
    @Transactional
    void getNonExistingTypePathologie() throws Exception {
        // Get the typePathologie
        restTypePathologieMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTypePathologie() throws Exception {
        // Initialize the database
        typePathologieRepository.saveAndFlush(typePathologie);

        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();

        // Update the typePathologie
        TypePathologie updatedTypePathologie = typePathologieRepository.findById(typePathologie.getId()).get();
        // Disconnect from session so that the updates on updatedTypePathologie are not directly saved in db
        em.detach(updatedTypePathologie);
        updatedTypePathologie.typePathologie(UPDATED_TYPE_PATHOLOGIE);

        restTypePathologieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypePathologie.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypePathologie))
            )
            .andExpect(status().isOk());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
        TypePathologie testTypePathologie = typePathologieList.get(typePathologieList.size() - 1);
        assertThat(testTypePathologie.getTypePathologie()).isEqualTo(UPDATED_TYPE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void putNonExistingTypePathologie() throws Exception {
        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();
        typePathologie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypePathologieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typePathologie.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typePathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypePathologie() throws Exception {
        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();
        typePathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypePathologieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typePathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypePathologie() throws Exception {
        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();
        typePathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypePathologieMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typePathologie)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypePathologieWithPatch() throws Exception {
        // Initialize the database
        typePathologieRepository.saveAndFlush(typePathologie);

        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();

        // Update the typePathologie using partial update
        TypePathologie partialUpdatedTypePathologie = new TypePathologie();
        partialUpdatedTypePathologie.setId(typePathologie.getId());

        partialUpdatedTypePathologie.typePathologie(UPDATED_TYPE_PATHOLOGIE);

        restTypePathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypePathologie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypePathologie))
            )
            .andExpect(status().isOk());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
        TypePathologie testTypePathologie = typePathologieList.get(typePathologieList.size() - 1);
        assertThat(testTypePathologie.getTypePathologie()).isEqualTo(UPDATED_TYPE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void fullUpdateTypePathologieWithPatch() throws Exception {
        // Initialize the database
        typePathologieRepository.saveAndFlush(typePathologie);

        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();

        // Update the typePathologie using partial update
        TypePathologie partialUpdatedTypePathologie = new TypePathologie();
        partialUpdatedTypePathologie.setId(typePathologie.getId());

        partialUpdatedTypePathologie.typePathologie(UPDATED_TYPE_PATHOLOGIE);

        restTypePathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypePathologie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypePathologie))
            )
            .andExpect(status().isOk());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
        TypePathologie testTypePathologie = typePathologieList.get(typePathologieList.size() - 1);
        assertThat(testTypePathologie.getTypePathologie()).isEqualTo(UPDATED_TYPE_PATHOLOGIE);
    }

    @Test
    @Transactional
    void patchNonExistingTypePathologie() throws Exception {
        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();
        typePathologie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypePathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typePathologie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typePathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypePathologie() throws Exception {
        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();
        typePathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypePathologieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typePathologie))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypePathologie() throws Exception {
        int databaseSizeBeforeUpdate = typePathologieRepository.findAll().size();
        typePathologie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypePathologieMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typePathologie))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypePathologie in the database
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypePathologie() throws Exception {
        // Initialize the database
        typePathologieRepository.saveAndFlush(typePathologie);

        int databaseSizeBeforeDelete = typePathologieRepository.findAll().size();

        // Delete the typePathologie
        restTypePathologieMockMvc
            .perform(delete(ENTITY_API_URL_ID, typePathologie.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypePathologie> typePathologieList = typePathologieRepository.findAll();
        assertThat(typePathologieList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
