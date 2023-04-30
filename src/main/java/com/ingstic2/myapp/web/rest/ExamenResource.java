package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Examen;
import com.ingstic2.myapp.repository.ExamenRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.Examen}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExamenResource {

    private final Logger log = LoggerFactory.getLogger(ExamenResource.class);

    private static final String ENTITY_NAME = "examen";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExamenRepository examenRepository;

    public ExamenResource(ExamenRepository examenRepository) {
        this.examenRepository = examenRepository;
    }

    /**
     * {@code POST  /examen} : Create a new examen.
     *
     * @param examen the examen to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new examen, or with status {@code 400 (Bad Request)} if the examen has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/examen")
    public ResponseEntity<Examen> createExamen(@RequestBody Examen examen) throws URISyntaxException {
        log.debug("REST request to save Examen : {}", examen);
        if (examen.getId() != null) {
            throw new BadRequestAlertException("A new examen cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Examen result = examenRepository.save(examen);
        return ResponseEntity
            .created(new URI("/api/examen/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /examen/:id} : Updates an existing examen.
     *
     * @param id the id of the examen to save.
     * @param examen the examen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examen,
     * or with status {@code 400 (Bad Request)} if the examen is not valid,
     * or with status {@code 500 (Internal Server Error)} if the examen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/examen/{id}")
    public ResponseEntity<Examen> updateExamen(@PathVariable(value = "id", required = false) final Long id, @RequestBody Examen examen)
        throws URISyntaxException {
        log.debug("REST request to update Examen : {}, {}", id, examen);
        if (examen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Examen result = examenRepository.save(examen);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examen.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /examen/:id} : Partial updates given fields of an existing examen, field will ignore if it is null
     *
     * @param id the id of the examen to save.
     * @param examen the examen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examen,
     * or with status {@code 400 (Bad Request)} if the examen is not valid,
     * or with status {@code 404 (Not Found)} if the examen is not found,
     * or with status {@code 500 (Internal Server Error)} if the examen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/examen/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Examen> partialUpdateExamen(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Examen examen
    ) throws URISyntaxException {
        log.debug("REST request to partial update Examen partially : {}, {}", id, examen);
        if (examen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Examen> result = examenRepository
            .findById(examen.getId())
            .map(existingExamen -> {
                if (examen.getExamenLibelle() != null) {
                    existingExamen.setExamenLibelle(examen.getExamenLibelle());
                }

                return existingExamen;
            })
            .map(examenRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examen.getId().toString())
        );
    }

    /**
     * {@code GET  /examen} : get all the examen.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of examen in body.
     */
    @GetMapping("/examen")
    public List<Examen> getAllExamen(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Examen");
        if (eagerload) {
            return examenRepository.findAllWithEagerRelationships();
        } else {
            return examenRepository.findAll();
        }
    }

    /**
     * {@code GET  /examen/:id} : get the "id" examen.
     *
     * @param id the id of the examen to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the examen, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/examen/{id}")
    public ResponseEntity<Examen> getExamen(@PathVariable Long id) {
        log.debug("REST request to get Examen : {}", id);
        Optional<Examen> examen = examenRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(examen);
    }

    /**
     * {@code DELETE  /examen/:id} : delete the "id" examen.
     *
     * @param id the id of the examen to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/examen/{id}")
    public ResponseEntity<Void> deleteExamen(@PathVariable Long id) {
        log.debug("REST request to delete Examen : {}", id);
        examenRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
