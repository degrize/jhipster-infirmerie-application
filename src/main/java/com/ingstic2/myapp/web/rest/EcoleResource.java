package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Ecole;
import com.ingstic2.myapp.repository.EcoleRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.Ecole}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EcoleResource {

    private final Logger log = LoggerFactory.getLogger(EcoleResource.class);

    private static final String ENTITY_NAME = "ecole";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EcoleRepository ecoleRepository;

    public EcoleResource(EcoleRepository ecoleRepository) {
        this.ecoleRepository = ecoleRepository;
    }

    /**
     * {@code POST  /ecoles} : Create a new ecole.
     *
     * @param ecole the ecole to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ecole, or with status {@code 400 (Bad Request)} if the ecole has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ecoles")
    public ResponseEntity<Ecole> createEcole(@RequestBody Ecole ecole) throws URISyntaxException {
        log.debug("REST request to save Ecole : {}", ecole);
        if (ecole.getId() != null) {
            throw new BadRequestAlertException("A new ecole cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ecole result = ecoleRepository.save(ecole);
        return ResponseEntity
            .created(new URI("/api/ecoles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ecoles/:id} : Updates an existing ecole.
     *
     * @param id the id of the ecole to save.
     * @param ecole the ecole to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ecole,
     * or with status {@code 400 (Bad Request)} if the ecole is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ecole couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ecoles/{id}")
    public ResponseEntity<Ecole> updateEcole(@PathVariable(value = "id", required = false) final Long id, @RequestBody Ecole ecole)
        throws URISyntaxException {
        log.debug("REST request to update Ecole : {}, {}", id, ecole);
        if (ecole.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ecole.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ecoleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ecole result = ecoleRepository.save(ecole);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ecole.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ecoles/:id} : Partial updates given fields of an existing ecole, field will ignore if it is null
     *
     * @param id the id of the ecole to save.
     * @param ecole the ecole to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ecole,
     * or with status {@code 400 (Bad Request)} if the ecole is not valid,
     * or with status {@code 404 (Not Found)} if the ecole is not found,
     * or with status {@code 500 (Internal Server Error)} if the ecole couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ecoles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ecole> partialUpdateEcole(@PathVariable(value = "id", required = false) final Long id, @RequestBody Ecole ecole)
        throws URISyntaxException {
        log.debug("REST request to partial update Ecole partially : {}, {}", id, ecole);
        if (ecole.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ecole.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ecoleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ecole> result = ecoleRepository
            .findById(ecole.getId())
            .map(existingEcole -> {
                if (ecole.getNom() != null) {
                    existingEcole.setNom(ecole.getNom());
                }

                return existingEcole;
            })
            .map(ecoleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ecole.getId().toString())
        );
    }

    /**
     * {@code GET  /ecoles} : get all the ecoles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ecoles in body.
     */
    @GetMapping("/ecoles")
    public List<Ecole> getAllEcoles() {
        log.debug("REST request to get all Ecoles");
        return ecoleRepository.findAll();
    }

    /**
     * {@code GET  /ecoles/:id} : get the "id" ecole.
     *
     * @param id the id of the ecole to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ecole, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ecoles/{id}")
    public ResponseEntity<Ecole> getEcole(@PathVariable Long id) {
        log.debug("REST request to get Ecole : {}", id);
        Optional<Ecole> ecole = ecoleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ecole);
    }

    /**
     * {@code DELETE  /ecoles/:id} : delete the "id" ecole.
     *
     * @param id the id of the ecole to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ecoles/{id}")
    public ResponseEntity<Void> deleteEcole(@PathVariable Long id) {
        log.debug("REST request to delete Ecole : {}", id);
        ecoleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
