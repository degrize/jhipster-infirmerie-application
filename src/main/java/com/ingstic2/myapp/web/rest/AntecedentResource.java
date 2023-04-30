package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Antecedent;
import com.ingstic2.myapp.repository.AntecedentRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.Antecedent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AntecedentResource {

    private final Logger log = LoggerFactory.getLogger(AntecedentResource.class);

    private static final String ENTITY_NAME = "antecedent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AntecedentRepository antecedentRepository;

    public AntecedentResource(AntecedentRepository antecedentRepository) {
        this.antecedentRepository = antecedentRepository;
    }

    /**
     * {@code POST  /antecedents} : Create a new antecedent.
     *
     * @param antecedent the antecedent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new antecedent, or with status {@code 400 (Bad Request)} if the antecedent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/antecedents")
    public ResponseEntity<Antecedent> createAntecedent(@RequestBody Antecedent antecedent) throws URISyntaxException {
        log.debug("REST request to save Antecedent : {}", antecedent);
        if (antecedent.getId() != null) {
            throw new BadRequestAlertException("A new antecedent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Antecedent result = antecedentRepository.save(antecedent);
        return ResponseEntity
            .created(new URI("/api/antecedents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /antecedents/:id} : Updates an existing antecedent.
     *
     * @param id the id of the antecedent to save.
     * @param antecedent the antecedent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antecedent,
     * or with status {@code 400 (Bad Request)} if the antecedent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the antecedent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/antecedents/{id}")
    public ResponseEntity<Antecedent> updateAntecedent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Antecedent antecedent
    ) throws URISyntaxException {
        log.debug("REST request to update Antecedent : {}, {}", id, antecedent);
        if (antecedent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antecedent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antecedentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Antecedent result = antecedentRepository.save(antecedent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antecedent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /antecedents/:id} : Partial updates given fields of an existing antecedent, field will ignore if it is null
     *
     * @param id the id of the antecedent to save.
     * @param antecedent the antecedent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antecedent,
     * or with status {@code 400 (Bad Request)} if the antecedent is not valid,
     * or with status {@code 404 (Not Found)} if the antecedent is not found,
     * or with status {@code 500 (Internal Server Error)} if the antecedent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/antecedents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Antecedent> partialUpdateAntecedent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Antecedent antecedent
    ) throws URISyntaxException {
        log.debug("REST request to partial update Antecedent partially : {}, {}", id, antecedent);
        if (antecedent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antecedent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antecedentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Antecedent> result = antecedentRepository
            .findById(antecedent.getId())
            .map(existingAntecedent -> {
                if (antecedent.getLibAntecedent() != null) {
                    existingAntecedent.setLibAntecedent(antecedent.getLibAntecedent());
                }

                return existingAntecedent;
            })
            .map(antecedentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antecedent.getId().toString())
        );
    }

    /**
     * {@code GET  /antecedents} : get all the antecedents.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of antecedents in body.
     */
    @GetMapping("/antecedents")
    public List<Antecedent> getAllAntecedents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Antecedents");
        if (eagerload) {
            return antecedentRepository.findAllWithEagerRelationships();
        } else {
            return antecedentRepository.findAll();
        }
    }

    /**
     * {@code GET  /antecedents/:id} : get the "id" antecedent.
     *
     * @param id the id of the antecedent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the antecedent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/antecedents/{id}")
    public ResponseEntity<Antecedent> getAntecedent(@PathVariable Long id) {
        log.debug("REST request to get Antecedent : {}", id);
        Optional<Antecedent> antecedent = antecedentRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(antecedent);
    }

    /**
     * {@code DELETE  /antecedents/:id} : delete the "id" antecedent.
     *
     * @param id the id of the antecedent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/antecedents/{id}")
    public ResponseEntity<Void> deleteAntecedent(@PathVariable Long id) {
        log.debug("REST request to delete Antecedent : {}", id);
        antecedentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
