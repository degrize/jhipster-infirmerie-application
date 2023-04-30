package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Personnel;
import com.ingstic2.myapp.repository.PersonnelRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.Personnel}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PersonnelResource {

    private final Logger log = LoggerFactory.getLogger(PersonnelResource.class);

    private static final String ENTITY_NAME = "personnel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonnelRepository personnelRepository;

    public PersonnelResource(PersonnelRepository personnelRepository) {
        this.personnelRepository = personnelRepository;
    }

    /**
     * {@code POST  /personnel} : Create a new personnel.
     *
     * @param personnel the personnel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new personnel, or with status {@code 400 (Bad Request)} if the personnel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/personnel")
    public ResponseEntity<Personnel> createPersonnel(@RequestBody Personnel personnel) throws URISyntaxException {
        log.debug("REST request to save Personnel : {}", personnel);
        if (personnel.getId() != null) {
            throw new BadRequestAlertException("A new personnel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Personnel result = personnelRepository.save(personnel);
        return ResponseEntity
            .created(new URI("/api/personnel/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /personnel/:id} : Updates an existing personnel.
     *
     * @param id the id of the personnel to save.
     * @param personnel the personnel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personnel,
     * or with status {@code 400 (Bad Request)} if the personnel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the personnel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/personnel/{id}")
    public ResponseEntity<Personnel> updatePersonnel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Personnel personnel
    ) throws URISyntaxException {
        log.debug("REST request to update Personnel : {}, {}", id, personnel);
        if (personnel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personnel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personnelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Personnel result = personnelRepository.save(personnel);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personnel.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /personnel/:id} : Partial updates given fields of an existing personnel, field will ignore if it is null
     *
     * @param id the id of the personnel to save.
     * @param personnel the personnel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personnel,
     * or with status {@code 400 (Bad Request)} if the personnel is not valid,
     * or with status {@code 404 (Not Found)} if the personnel is not found,
     * or with status {@code 500 (Internal Server Error)} if the personnel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/personnel/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Personnel> partialUpdatePersonnel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Personnel personnel
    ) throws URISyntaxException {
        log.debug("REST request to partial update Personnel partially : {}, {}", id, personnel);
        if (personnel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personnel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personnelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Personnel> result = personnelRepository
            .findById(personnel.getId())
            .map(existingPersonnel -> {
                if (personnel.getMatricule() != null) {
                    existingPersonnel.setMatricule(personnel.getMatricule());
                }

                return existingPersonnel;
            })
            .map(personnelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personnel.getId().toString())
        );
    }

    /**
     * {@code GET  /personnel} : get all the personnel.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of personnel in body.
     */
    @GetMapping("/personnel")
    public List<Personnel> getAllPersonnel(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Personnel");
        if (eagerload) {
            return personnelRepository.findAllWithEagerRelationships();
        } else {
            return personnelRepository.findAll();
        }
    }

    /**
     * {@code GET  /personnel/:id} : get the "id" personnel.
     *
     * @param id the id of the personnel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the personnel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/personnel/{id}")
    public ResponseEntity<Personnel> getPersonnel(@PathVariable Long id) {
        log.debug("REST request to get Personnel : {}", id);
        Optional<Personnel> personnel = personnelRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(personnel);
    }

    /**
     * {@code DELETE  /personnel/:id} : delete the "id" personnel.
     *
     * @param id the id of the personnel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/personnel/{id}")
    public ResponseEntity<Void> deletePersonnel(@PathVariable Long id) {
        log.debug("REST request to delete Personnel : {}", id);
        personnelRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
