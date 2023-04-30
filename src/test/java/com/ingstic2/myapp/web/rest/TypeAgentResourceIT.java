package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.TypeAgent;
import com.ingstic2.myapp.repository.TypeAgentRepository;
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
 * Integration tests for the {@link TypeAgentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TypeAgentResourceIT {

    private static final String DEFAULT_TYPE_AGENT = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_AGENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-agents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeAgentRepository typeAgentRepository;

    @Mock
    private TypeAgentRepository typeAgentRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeAgentMockMvc;

    private TypeAgent typeAgent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeAgent createEntity(EntityManager em) {
        TypeAgent typeAgent = new TypeAgent().typeAgent(DEFAULT_TYPE_AGENT);
        return typeAgent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeAgent createUpdatedEntity(EntityManager em) {
        TypeAgent typeAgent = new TypeAgent().typeAgent(UPDATED_TYPE_AGENT);
        return typeAgent;
    }

    @BeforeEach
    public void initTest() {
        typeAgent = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeAgent() throws Exception {
        int databaseSizeBeforeCreate = typeAgentRepository.findAll().size();
        // Create the TypeAgent
        restTypeAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeAgent)))
            .andExpect(status().isCreated());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeCreate + 1);
        TypeAgent testTypeAgent = typeAgentList.get(typeAgentList.size() - 1);
        assertThat(testTypeAgent.getTypeAgent()).isEqualTo(DEFAULT_TYPE_AGENT);
    }

    @Test
    @Transactional
    void createTypeAgentWithExistingId() throws Exception {
        // Create the TypeAgent with an existing ID
        typeAgent.setId(1L);

        int databaseSizeBeforeCreate = typeAgentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeAgent)))
            .andExpect(status().isBadRequest());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeAgents() throws Exception {
        // Initialize the database
        typeAgentRepository.saveAndFlush(typeAgent);

        // Get all the typeAgentList
        restTypeAgentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeAgent.getId().intValue())))
            .andExpect(jsonPath("$.[*].typeAgent").value(hasItem(DEFAULT_TYPE_AGENT)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTypeAgentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(typeAgentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTypeAgentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(typeAgentRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTypeAgentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(typeAgentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTypeAgentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(typeAgentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTypeAgent() throws Exception {
        // Initialize the database
        typeAgentRepository.saveAndFlush(typeAgent);

        // Get the typeAgent
        restTypeAgentMockMvc
            .perform(get(ENTITY_API_URL_ID, typeAgent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeAgent.getId().intValue()))
            .andExpect(jsonPath("$.typeAgent").value(DEFAULT_TYPE_AGENT));
    }

    @Test
    @Transactional
    void getNonExistingTypeAgent() throws Exception {
        // Get the typeAgent
        restTypeAgentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTypeAgent() throws Exception {
        // Initialize the database
        typeAgentRepository.saveAndFlush(typeAgent);

        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();

        // Update the typeAgent
        TypeAgent updatedTypeAgent = typeAgentRepository.findById(typeAgent.getId()).get();
        // Disconnect from session so that the updates on updatedTypeAgent are not directly saved in db
        em.detach(updatedTypeAgent);
        updatedTypeAgent.typeAgent(UPDATED_TYPE_AGENT);

        restTypeAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeAgent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeAgent))
            )
            .andExpect(status().isOk());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
        TypeAgent testTypeAgent = typeAgentList.get(typeAgentList.size() - 1);
        assertThat(testTypeAgent.getTypeAgent()).isEqualTo(UPDATED_TYPE_AGENT);
    }

    @Test
    @Transactional
    void putNonExistingTypeAgent() throws Exception {
        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();
        typeAgent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeAgent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeAgent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeAgent() throws Exception {
        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();
        typeAgent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeAgent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeAgent() throws Exception {
        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();
        typeAgent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeAgentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeAgent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeAgentWithPatch() throws Exception {
        // Initialize the database
        typeAgentRepository.saveAndFlush(typeAgent);

        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();

        // Update the typeAgent using partial update
        TypeAgent partialUpdatedTypeAgent = new TypeAgent();
        partialUpdatedTypeAgent.setId(typeAgent.getId());

        partialUpdatedTypeAgent.typeAgent(UPDATED_TYPE_AGENT);

        restTypeAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeAgent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeAgent))
            )
            .andExpect(status().isOk());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
        TypeAgent testTypeAgent = typeAgentList.get(typeAgentList.size() - 1);
        assertThat(testTypeAgent.getTypeAgent()).isEqualTo(UPDATED_TYPE_AGENT);
    }

    @Test
    @Transactional
    void fullUpdateTypeAgentWithPatch() throws Exception {
        // Initialize the database
        typeAgentRepository.saveAndFlush(typeAgent);

        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();

        // Update the typeAgent using partial update
        TypeAgent partialUpdatedTypeAgent = new TypeAgent();
        partialUpdatedTypeAgent.setId(typeAgent.getId());

        partialUpdatedTypeAgent.typeAgent(UPDATED_TYPE_AGENT);

        restTypeAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeAgent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeAgent))
            )
            .andExpect(status().isOk());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
        TypeAgent testTypeAgent = typeAgentList.get(typeAgentList.size() - 1);
        assertThat(testTypeAgent.getTypeAgent()).isEqualTo(UPDATED_TYPE_AGENT);
    }

    @Test
    @Transactional
    void patchNonExistingTypeAgent() throws Exception {
        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();
        typeAgent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeAgent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeAgent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeAgent() throws Exception {
        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();
        typeAgent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeAgent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeAgent() throws Exception {
        int databaseSizeBeforeUpdate = typeAgentRepository.findAll().size();
        typeAgent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeAgentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typeAgent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeAgent in the database
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeAgent() throws Exception {
        // Initialize the database
        typeAgentRepository.saveAndFlush(typeAgent);

        int databaseSizeBeforeDelete = typeAgentRepository.findAll().size();

        // Delete the typeAgent
        restTypeAgentMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeAgent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeAgent> typeAgentList = typeAgentRepository.findAll();
        assertThat(typeAgentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
