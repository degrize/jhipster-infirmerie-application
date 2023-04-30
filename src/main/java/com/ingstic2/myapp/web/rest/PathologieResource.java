package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Pathologie;
import com.ingstic2.myapp.repository.PathologieRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.Pathologie}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PathologieResource {

    private final Logger log = LoggerFactory.getLogger(PathologieResource.class);

    private static final String ENTITY_NAME = "pathologie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PathologieRepository pathologieRepository;

    public PathologieResource(PathologieRepository pathologieRepository) {
        this.pathologieRepository = pathologieRepository;
    }

    /**
     * {@code POST  /pathologies} : Create a new pathologie.
     *
     * @param pathologie the pathologie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pathologie, or with status {@code 400 (Bad Request)} if the pathologie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pathologies")
    public ResponseEntity<Pathologie> createPathologie(@RequestBody Pathologie pathologie) throws URISyntaxException {
        log.debug("REST request to save Pathologie : {}", pathologie);
        if (pathologie.getId() != null) {
            throw new BadRequestAlertException("A new pathologie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pathologie result = pathologieRepository.save(pathologie);
        return ResponseEntity
            .created(new URI("/api/pathologies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pathologies/:id} : Updates an existing pathologie.
     *
     * @param id the id of the pathologie to save.
     * @param pathologie the pathologie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pathologie,
     * or with status {@code 400 (Bad Request)} if the pathologie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pathologie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pathologies/{id}")
    public ResponseEntity<Pathologie> updatePathologie(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Pathologie pathologie
    ) throws URISyntaxException {
        log.debug("REST request to update Pathologie : {}, {}", id, pathologie);
        if (pathologie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pathologie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pathologieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pathologie result = pathologieRepository.save(pathologie);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pathologie.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pathologies/:id} : Partial updates given fields of an existing pathologie, field will ignore if it is null
     *
     * @param id the id of the pathologie to save.
     * @param pathologie the pathologie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pathologie,
     * or with status {@code 400 (Bad Request)} if the pathologie is not valid,
     * or with status {@code 404 (Not Found)} if the pathologie is not found,
     * or with status {@code 500 (Internal Server Error)} if the pathologie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pathologies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pathologie> partialUpdatePathologie(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Pathologie pathologie
    ) throws URISyntaxException {
        log.debug("REST request to partial update Pathologie partially : {}, {}", id, pathologie);
        if (pathologie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pathologie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pathologieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pathologie> result = pathologieRepository
            .findById(pathologie.getId())
            .map(existingPathologie -> {
                if (pathologie.getLibellePathologie() != null) {
                    existingPathologie.setLibellePathologie(pathologie.getLibellePathologie());
                }

                return existingPathologie;
            })
            .map(pathologieRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pathologie.getId().toString())
        );
    }

    /**
     * {@code GET  /pathologies} : get all the pathologies.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pathologies in body.
     */
    @GetMapping("/pathologies")
    public List<Pathologie> getAllPathologies(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Pathologies");
        if (eagerload) {
            return pathologieRepository.findAllWithEagerRelationships();
        } else {
            return pathologieRepository.findAll();
        }
    }

    /**
     * {@code GET  /pathologies/:id} : get the "id" pathologie.
     *
     * @param id the id of the pathologie to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pathologie, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pathologies/{id}")
    public ResponseEntity<Pathologie> getPathologie(@PathVariable Long id) {
        log.debug("REST request to get Pathologie : {}", id);
        Optional<Pathologie> pathologie = pathologieRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(pathologie);
    }

    /**
     * {@code DELETE  /pathologies/:id} : delete the "id" pathologie.
     *
     * @param id the id of the pathologie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pathologies/{id}")
    public ResponseEntity<Void> deletePathologie(@PathVariable Long id) {
        log.debug("REST request to delete Pathologie : {}", id);
        pathologieRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
