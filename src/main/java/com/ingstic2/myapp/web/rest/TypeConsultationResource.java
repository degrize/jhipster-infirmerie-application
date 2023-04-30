package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.TypeConsultation;
import com.ingstic2.myapp.repository.TypeConsultationRepository;
import com.ingstic2.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ingstic2.myapp.domain.TypeConsultation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypeConsultationResource {

    private final Logger log = LoggerFactory.getLogger(TypeConsultationResource.class);

    private static final String ENTITY_NAME = "typeConsultation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeConsultationRepository typeConsultationRepository;

    public TypeConsultationResource(TypeConsultationRepository typeConsultationRepository) {
        this.typeConsultationRepository = typeConsultationRepository;
    }

    /**
     * {@code POST  /type-consultations} : Create a new typeConsultation.
     *
     * @param typeConsultation the typeConsultation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeConsultation, or with status {@code 400 (Bad Request)} if the typeConsultation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-consultations")
    public ResponseEntity<TypeConsultation> createTypeConsultation(@RequestBody TypeConsultation typeConsultation)
        throws URISyntaxException {
        log.debug("REST request to save TypeConsultation : {}", typeConsultation);
        if (typeConsultation.getId() != null) {
            throw new BadRequestAlertException("A new typeConsultation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeConsultation result = typeConsultationRepository.save(typeConsultation);
        return ResponseEntity
            .created(new URI("/api/type-consultations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-consultations/:id} : Updates an existing typeConsultation.
     *
     * @param id the id of the typeConsultation to save.
     * @param typeConsultation the typeConsultation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeConsultation,
     * or with status {@code 400 (Bad Request)} if the typeConsultation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeConsultation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-consultations/{id}")
    public ResponseEntity<TypeConsultation> updateTypeConsultation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeConsultation typeConsultation
    ) throws URISyntaxException {
        log.debug("REST request to update TypeConsultation : {}, {}", id, typeConsultation);
        if (typeConsultation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeConsultation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeConsultationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeConsultation result = typeConsultationRepository.save(typeConsultation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeConsultation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-consultations/:id} : Partial updates given fields of an existing typeConsultation, field will ignore if it is null
     *
     * @param id the id of the typeConsultation to save.
     * @param typeConsultation the typeConsultation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeConsultation,
     * or with status {@code 400 (Bad Request)} if the typeConsultation is not valid,
     * or with status {@code 404 (Not Found)} if the typeConsultation is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeConsultation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-consultations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeConsultation> partialUpdateTypeConsultation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeConsultation typeConsultation
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeConsultation partially : {}, {}", id, typeConsultation);
        if (typeConsultation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeConsultation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeConsultationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeConsultation> result = typeConsultationRepository
            .findById(typeConsultation.getId())
            .map(existingTypeConsultation -> {
                if (typeConsultation.getLibelleTypeConsultation() != null) {
                    existingTypeConsultation.setLibelleTypeConsultation(typeConsultation.getLibelleTypeConsultation());
                }

                return existingTypeConsultation;
            })
            .map(typeConsultationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeConsultation.getId().toString())
        );
    }

    /**
     * {@code GET  /type-consultations} : get all the typeConsultations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeConsultations in body.
     */
    @GetMapping("/type-consultations")
    public List<TypeConsultation> getAllTypeConsultations() {
        log.debug("REST request to get all TypeConsultations");
        return typeConsultationRepository.findAll();
    }

    /**
     * {@code GET  /type-consultations/:id} : get the "id" typeConsultation.
     *
     * @param id the id of the typeConsultation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeConsultation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-consultations/{id}")
    public ResponseEntity<TypeConsultation> getTypeConsultation(@PathVariable Long id) {
        log.debug("REST request to get TypeConsultation : {}", id);
        Optional<TypeConsultation> typeConsultation = typeConsultationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typeConsultation);
    }

    /**
     * {@code DELETE  /type-consultations/:id} : delete the "id" typeConsultation.
     *
     * @param id the id of the typeConsultation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-consultations/{id}")
    public ResponseEntity<Void> deleteTypeConsultation(@PathVariable Long id) {
        log.debug("REST request to delete TypeConsultation : {}", id);
        typeConsultationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
