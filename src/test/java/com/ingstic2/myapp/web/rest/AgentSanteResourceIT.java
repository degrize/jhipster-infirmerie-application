package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.AgentSante;
import com.ingstic2.myapp.repository.AgentSanteRepository;
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
 * Integration tests for the {@link AgentSanteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AgentSanteResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_LOGIN = "AAAAAAAAAA";
    private static final String UPDATED_LOGIN = "BBBBBBBBBB";

    private static final String DEFAULT_MOT_DE_PASSE = "AAAAAAAAAA";
    private static final String UPDATED_MOT_DE_PASSE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/agent-santes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AgentSanteRepository agentSanteRepository;

    @Mock
    private AgentSanteRepository agentSanteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAgentSanteMockMvc;

    private AgentSante agentSante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgentSante createEntity(EntityManager em) {
        AgentSante agentSante = new AgentSante()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .contact(DEFAULT_CONTACT)
            .adresse(DEFAULT_ADRESSE)
            .login(DEFAULT_LOGIN)
            .motDePasse(DEFAULT_MOT_DE_PASSE);
        return agentSante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgentSante createUpdatedEntity(EntityManager em) {
        AgentSante agentSante = new AgentSante()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .contact(UPDATED_CONTACT)
            .adresse(UPDATED_ADRESSE)
            .login(UPDATED_LOGIN)
            .motDePasse(UPDATED_MOT_DE_PASSE);
        return agentSante;
    }

    @BeforeEach
    public void initTest() {
        agentSante = createEntity(em);
    }

    @Test
    @Transactional
    void createAgentSante() throws Exception {
        int databaseSizeBeforeCreate = agentSanteRepository.findAll().size();
        // Create the AgentSante
        restAgentSanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentSante)))
            .andExpect(status().isCreated());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeCreate + 1);
        AgentSante testAgentSante = agentSanteList.get(agentSanteList.size() - 1);
        assertThat(testAgentSante.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testAgentSante.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testAgentSante.getContact()).isEqualTo(DEFAULT_CONTACT);
        assertThat(testAgentSante.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testAgentSante.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(testAgentSante.getMotDePasse()).isEqualTo(DEFAULT_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void createAgentSanteWithExistingId() throws Exception {
        // Create the AgentSante with an existing ID
        agentSante.setId(1L);

        int databaseSizeBeforeCreate = agentSanteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAgentSanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentSante)))
            .andExpect(status().isBadRequest());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAgentSantes() throws Exception {
        // Initialize the database
        agentSanteRepository.saveAndFlush(agentSante);

        // Get all the agentSanteList
        restAgentSanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(agentSante.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN)))
            .andExpect(jsonPath("$.[*].motDePasse").value(hasItem(DEFAULT_MOT_DE_PASSE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAgentSantesWithEagerRelationshipsIsEnabled() throws Exception {
        when(agentSanteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAgentSanteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(agentSanteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAgentSantesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(agentSanteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAgentSanteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(agentSanteRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAgentSante() throws Exception {
        // Initialize the database
        agentSanteRepository.saveAndFlush(agentSante);

        // Get the agentSante
        restAgentSanteMockMvc
            .perform(get(ENTITY_API_URL_ID, agentSante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(agentSante.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.login").value(DEFAULT_LOGIN))
            .andExpect(jsonPath("$.motDePasse").value(DEFAULT_MOT_DE_PASSE));
    }

    @Test
    @Transactional
    void getNonExistingAgentSante() throws Exception {
        // Get the agentSante
        restAgentSanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAgentSante() throws Exception {
        // Initialize the database
        agentSanteRepository.saveAndFlush(agentSante);

        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();

        // Update the agentSante
        AgentSante updatedAgentSante = agentSanteRepository.findById(agentSante.getId()).get();
        // Disconnect from session so that the updates on updatedAgentSante are not directly saved in db
        em.detach(updatedAgentSante);
        updatedAgentSante
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .contact(UPDATED_CONTACT)
            .adresse(UPDATED_ADRESSE)
            .login(UPDATED_LOGIN)
            .motDePasse(UPDATED_MOT_DE_PASSE);

        restAgentSanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAgentSante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAgentSante))
            )
            .andExpect(status().isOk());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
        AgentSante testAgentSante = agentSanteList.get(agentSanteList.size() - 1);
        assertThat(testAgentSante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testAgentSante.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testAgentSante.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testAgentSante.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testAgentSante.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testAgentSante.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void putNonExistingAgentSante() throws Exception {
        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();
        agentSante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentSanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agentSante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAgentSante() throws Exception {
        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();
        agentSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentSanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAgentSante() throws Exception {
        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();
        agentSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentSanteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentSante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAgentSanteWithPatch() throws Exception {
        // Initialize the database
        agentSanteRepository.saveAndFlush(agentSante);

        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();

        // Update the agentSante using partial update
        AgentSante partialUpdatedAgentSante = new AgentSante();
        partialUpdatedAgentSante.setId(agentSante.getId());

        partialUpdatedAgentSante.adresse(UPDATED_ADRESSE).login(UPDATED_LOGIN).motDePasse(UPDATED_MOT_DE_PASSE);

        restAgentSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgentSante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgentSante))
            )
            .andExpect(status().isOk());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
        AgentSante testAgentSante = agentSanteList.get(agentSanteList.size() - 1);
        assertThat(testAgentSante.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testAgentSante.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testAgentSante.getContact()).isEqualTo(DEFAULT_CONTACT);
        assertThat(testAgentSante.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testAgentSante.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testAgentSante.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void fullUpdateAgentSanteWithPatch() throws Exception {
        // Initialize the database
        agentSanteRepository.saveAndFlush(agentSante);

        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();

        // Update the agentSante using partial update
        AgentSante partialUpdatedAgentSante = new AgentSante();
        partialUpdatedAgentSante.setId(agentSante.getId());

        partialUpdatedAgentSante
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .contact(UPDATED_CONTACT)
            .adresse(UPDATED_ADRESSE)
            .login(UPDATED_LOGIN)
            .motDePasse(UPDATED_MOT_DE_PASSE);

        restAgentSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgentSante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgentSante))
            )
            .andExpect(status().isOk());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
        AgentSante testAgentSante = agentSanteList.get(agentSanteList.size() - 1);
        assertThat(testAgentSante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testAgentSante.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testAgentSante.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testAgentSante.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testAgentSante.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testAgentSante.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void patchNonExistingAgentSante() throws Exception {
        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();
        agentSante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, agentSante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAgentSante() throws Exception {
        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();
        agentSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentSanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentSante))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAgentSante() throws Exception {
        int databaseSizeBeforeUpdate = agentSanteRepository.findAll().size();
        agentSante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentSanteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(agentSante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgentSante in the database
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAgentSante() throws Exception {
        // Initialize the database
        agentSanteRepository.saveAndFlush(agentSante);

        int databaseSizeBeforeDelete = agentSanteRepository.findAll().size();

        // Delete the agentSante
        restAgentSanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, agentSante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AgentSante> agentSanteList = agentSanteRepository.findAll();
        assertThat(agentSanteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
