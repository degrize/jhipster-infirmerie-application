package com.ingstic2.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ingstic2.myapp.IntegrationTest;
import com.ingstic2.myapp.domain.Patient;
import com.ingstic2.myapp.repository.PatientRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link PatientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PatientResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRE_NOM = "AAAAAAAAAA";
    private static final String UPDATED_PRE_NOM = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_NAISSANCE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_NAISSANCE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LIEU_NAISSANCE = "AAAAAAAAAA";
    private static final String UPDATED_LIEU_NAISSANCE = "BBBBBBBBBB";

    private static final String DEFAULT_SEXE = "AAAAAAAAAA";
    private static final String UPDATED_SEXE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String DEFAULT_STATUT = "AAAAAAAAAA";
    private static final String UPDATED_STATUT = "BBBBBBBBBB";

    private static final String DEFAULT_TABAC = "AAAAAAAAAA";
    private static final String UPDATED_TABAC = "BBBBBBBBBB";

    private static final String DEFAULT_ALCOOL = "AAAAAAAAAA";
    private static final String UPDATED_ALCOOL = "BBBBBBBBBB";

    private static final String DEFAULT_SPORT = "AAAAAAAAAA";
    private static final String UPDATED_SPORT = "BBBBBBBBBB";

    private static final String DEFAULT_CIGARETTE = "AAAAAAAAAA";
    private static final String UPDATED_CIGARETTE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_PARENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_PARENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/patients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPatientMockMvc;

    private Patient patient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patient createEntity(EntityManager em) {
        Patient patient = new Patient()
            .nom(DEFAULT_NOM)
            .preNom(DEFAULT_PRE_NOM)
            .dateNaissance(DEFAULT_DATE_NAISSANCE)
            .lieuNaissance(DEFAULT_LIEU_NAISSANCE)
            .sexe(DEFAULT_SEXE)
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE)
            .contact(DEFAULT_CONTACT)
            .statut(DEFAULT_STATUT)
            .tabac(DEFAULT_TABAC)
            .alcool(DEFAULT_ALCOOL)
            .sport(DEFAULT_SPORT)
            .cigarette(DEFAULT_CIGARETTE)
            .contactParent(DEFAULT_CONTACT_PARENT);
        return patient;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patient createUpdatedEntity(EntityManager em) {
        Patient patient = new Patient()
            .nom(UPDATED_NOM)
            .preNom(UPDATED_PRE_NOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .sexe(UPDATED_SEXE)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .contact(UPDATED_CONTACT)
            .statut(UPDATED_STATUT)
            .tabac(UPDATED_TABAC)
            .alcool(UPDATED_ALCOOL)
            .sport(UPDATED_SPORT)
            .cigarette(UPDATED_CIGARETTE)
            .contactParent(UPDATED_CONTACT_PARENT);
        return patient;
    }

    @BeforeEach
    public void initTest() {
        patient = createEntity(em);
    }

    @Test
    @Transactional
    void createPatient() throws Exception {
        int databaseSizeBeforeCreate = patientRepository.findAll().size();
        // Create the Patient
        restPatientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isCreated());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeCreate + 1);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPatient.getPreNom()).isEqualTo(DEFAULT_PRE_NOM);
        assertThat(testPatient.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testPatient.getLieuNaissance()).isEqualTo(DEFAULT_LIEU_NAISSANCE);
        assertThat(testPatient.getSexe()).isEqualTo(DEFAULT_SEXE);
        assertThat(testPatient.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testPatient.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
        assertThat(testPatient.getContact()).isEqualTo(DEFAULT_CONTACT);
        assertThat(testPatient.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testPatient.getTabac()).isEqualTo(DEFAULT_TABAC);
        assertThat(testPatient.getAlcool()).isEqualTo(DEFAULT_ALCOOL);
        assertThat(testPatient.getSport()).isEqualTo(DEFAULT_SPORT);
        assertThat(testPatient.getCigarette()).isEqualTo(DEFAULT_CIGARETTE);
        assertThat(testPatient.getContactParent()).isEqualTo(DEFAULT_CONTACT_PARENT);
    }

    @Test
    @Transactional
    void createPatientWithExistingId() throws Exception {
        // Create the Patient with an existing ID
        patient.setId(1L);

        int databaseSizeBeforeCreate = patientRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPatients() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        // Get all the patientList
        restPatientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patient.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].preNom").value(hasItem(DEFAULT_PRE_NOM)))
            .andExpect(jsonPath("$.[*].dateNaissance").value(hasItem(DEFAULT_DATE_NAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].lieuNaissance").value(hasItem(DEFAULT_LIEU_NAISSANCE)))
            .andExpect(jsonPath("$.[*].sexe").value(hasItem(DEFAULT_SEXE)))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT)))
            .andExpect(jsonPath("$.[*].tabac").value(hasItem(DEFAULT_TABAC)))
            .andExpect(jsonPath("$.[*].alcool").value(hasItem(DEFAULT_ALCOOL)))
            .andExpect(jsonPath("$.[*].sport").value(hasItem(DEFAULT_SPORT)))
            .andExpect(jsonPath("$.[*].cigarette").value(hasItem(DEFAULT_CIGARETTE)))
            .andExpect(jsonPath("$.[*].contactParent").value(hasItem(DEFAULT_CONTACT_PARENT)));
    }

    @Test
    @Transactional
    void getPatient() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        // Get the patient
        restPatientMockMvc
            .perform(get(ENTITY_API_URL_ID, patient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(patient.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.preNom").value(DEFAULT_PRE_NOM))
            .andExpect(jsonPath("$.dateNaissance").value(DEFAULT_DATE_NAISSANCE.toString()))
            .andExpect(jsonPath("$.lieuNaissance").value(DEFAULT_LIEU_NAISSANCE))
            .andExpect(jsonPath("$.sexe").value(DEFAULT_SEXE))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT))
            .andExpect(jsonPath("$.tabac").value(DEFAULT_TABAC))
            .andExpect(jsonPath("$.alcool").value(DEFAULT_ALCOOL))
            .andExpect(jsonPath("$.sport").value(DEFAULT_SPORT))
            .andExpect(jsonPath("$.cigarette").value(DEFAULT_CIGARETTE))
            .andExpect(jsonPath("$.contactParent").value(DEFAULT_CONTACT_PARENT));
    }

    @Test
    @Transactional
    void getNonExistingPatient() throws Exception {
        // Get the patient
        restPatientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPatient() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // Update the patient
        Patient updatedPatient = patientRepository.findById(patient.getId()).get();
        // Disconnect from session so that the updates on updatedPatient are not directly saved in db
        em.detach(updatedPatient);
        updatedPatient
            .nom(UPDATED_NOM)
            .preNom(UPDATED_PRE_NOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .sexe(UPDATED_SEXE)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .contact(UPDATED_CONTACT)
            .statut(UPDATED_STATUT)
            .tabac(UPDATED_TABAC)
            .alcool(UPDATED_ALCOOL)
            .sport(UPDATED_SPORT)
            .cigarette(UPDATED_CIGARETTE)
            .contactParent(UPDATED_CONTACT_PARENT);

        restPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPatient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPatient))
            )
            .andExpect(status().isOk());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPatient.getPreNom()).isEqualTo(UPDATED_PRE_NOM);
        assertThat(testPatient.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testPatient.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testPatient.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testPatient.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testPatient.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testPatient.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testPatient.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testPatient.getTabac()).isEqualTo(UPDATED_TABAC);
        assertThat(testPatient.getAlcool()).isEqualTo(UPDATED_ALCOOL);
        assertThat(testPatient.getSport()).isEqualTo(UPDATED_SPORT);
        assertThat(testPatient.getCigarette()).isEqualTo(UPDATED_CIGARETTE);
        assertThat(testPatient.getContactParent()).isEqualTo(UPDATED_CONTACT_PARENT);
    }

    @Test
    @Transactional
    void putNonExistingPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, patient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePatientWithPatch() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // Update the patient using partial update
        Patient partialUpdatedPatient = new Patient();
        partialUpdatedPatient.setId(patient.getId());

        partialUpdatedPatient
            .nom(UPDATED_NOM)
            .preNom(UPDATED_PRE_NOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .sport(UPDATED_SPORT);

        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatient))
            )
            .andExpect(status().isOk());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPatient.getPreNom()).isEqualTo(UPDATED_PRE_NOM);
        assertThat(testPatient.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testPatient.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testPatient.getSexe()).isEqualTo(DEFAULT_SEXE);
        assertThat(testPatient.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testPatient.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testPatient.getContact()).isEqualTo(DEFAULT_CONTACT);
        assertThat(testPatient.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testPatient.getTabac()).isEqualTo(DEFAULT_TABAC);
        assertThat(testPatient.getAlcool()).isEqualTo(DEFAULT_ALCOOL);
        assertThat(testPatient.getSport()).isEqualTo(UPDATED_SPORT);
        assertThat(testPatient.getCigarette()).isEqualTo(DEFAULT_CIGARETTE);
        assertThat(testPatient.getContactParent()).isEqualTo(DEFAULT_CONTACT_PARENT);
    }

    @Test
    @Transactional
    void fullUpdatePatientWithPatch() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // Update the patient using partial update
        Patient partialUpdatedPatient = new Patient();
        partialUpdatedPatient.setId(patient.getId());

        partialUpdatedPatient
            .nom(UPDATED_NOM)
            .preNom(UPDATED_PRE_NOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .sexe(UPDATED_SEXE)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .contact(UPDATED_CONTACT)
            .statut(UPDATED_STATUT)
            .tabac(UPDATED_TABAC)
            .alcool(UPDATED_ALCOOL)
            .sport(UPDATED_SPORT)
            .cigarette(UPDATED_CIGARETTE)
            .contactParent(UPDATED_CONTACT_PARENT);

        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatient))
            )
            .andExpect(status().isOk());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPatient.getPreNom()).isEqualTo(UPDATED_PRE_NOM);
        assertThat(testPatient.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testPatient.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testPatient.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testPatient.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testPatient.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testPatient.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testPatient.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testPatient.getTabac()).isEqualTo(UPDATED_TABAC);
        assertThat(testPatient.getAlcool()).isEqualTo(UPDATED_ALCOOL);
        assertThat(testPatient.getSport()).isEqualTo(UPDATED_SPORT);
        assertThat(testPatient.getCigarette()).isEqualTo(UPDATED_CIGARETTE);
        assertThat(testPatient.getContactParent()).isEqualTo(UPDATED_CONTACT_PARENT);
    }

    @Test
    @Transactional
    void patchNonExistingPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, patient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePatient() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        int databaseSizeBeforeDelete = patientRepository.findAll().size();

        // Delete the patient
        restPatientMockMvc
            .perform(delete(ENTITY_API_URL_ID, patient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
