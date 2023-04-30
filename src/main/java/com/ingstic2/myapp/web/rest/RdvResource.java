package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Rdv;
import com.ingstic2.myapp.repository.RdvRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.Rdv}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RdvResource {

    private final Logger log = LoggerFactory.getLogger(RdvResource.class);

    private static final String ENTITY_NAME = "rdv";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RdvRepository rdvRepository;

    public RdvResource(RdvRepository rdvRepository) {
        this.rdvRepository = rdvRepository;
    }

    /**
     * {@code POST  /rdvs} : Create a new rdv.
     *
     * @param rdv the rdv to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rdv, or with status {@code 400 (Bad Request)} if the rdv has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rdvs")
    public ResponseEntity<Rdv> createRdv(@RequestBody Rdv rdv) throws URISyntaxException {
        log.debug("REST request to save Rdv : {}", rdv);
        if (rdv.getId() != null) {
            throw new BadRequestAlertException("A new rdv cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Rdv result = rdvRepository.save(rdv);
        return ResponseEntity
            .created(new URI("/api/rdvs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rdvs/:id} : Updates an existing rdv.
     *
     * @param id the id of the rdv to save.
     * @param rdv the rdv to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rdv,
     * or with status {@code 400 (Bad Request)} if the rdv is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rdv couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rdvs/{id}")
    public ResponseEntity<Rdv> updateRdv(@PathVariable(value = "id", required = false) final Long id, @RequestBody Rdv rdv)
        throws URISyntaxException {
        log.debug("REST request to update Rdv : {}, {}", id, rdv);
        if (rdv.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rdv.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rdvRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Rdv result = rdvRepository.save(rdv);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rdv.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rdvs/:id} : Partial updates given fields of an existing rdv, field will ignore if it is null
     *
     * @param id the id of the rdv to save.
     * @param rdv the rdv to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rdv,
     * or with status {@code 400 (Bad Request)} if the rdv is not valid,
     * or with status {@code 404 (Not Found)} if the rdv is not found,
     * or with status {@code 500 (Internal Server Error)} if the rdv couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rdvs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Rdv> partialUpdateRdv(@PathVariable(value = "id", required = false) final Long id, @RequestBody Rdv rdv)
        throws URISyntaxException {
        log.debug("REST request to partial update Rdv partially : {}, {}", id, rdv);
        if (rdv.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rdv.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rdvRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Rdv> result = rdvRepository
            .findById(rdv.getId())
            .map(existingRdv -> {
                if (rdv.getDateRdv() != null) {
                    existingRdv.setDateRdv(rdv.getDateRdv());
                }
                if (rdv.getMotif() != null) {
                    existingRdv.setMotif(rdv.getMotif());
                }

                return existingRdv;
            })
            .map(rdvRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rdv.getId().toString())
        );
    }

    /**
     * {@code GET  /rdvs} : get all the rdvs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rdvs in body.
     */
    @GetMapping("/rdvs")
    public List<Rdv> getAllRdvs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Rdvs");
        if (eagerload) {
            return rdvRepository.findAllWithEagerRelationships();
        } else {
            return rdvRepository.findAll();
        }
    }

    /**
     * {@code GET  /rdvs/:id} : get the "id" rdv.
     *
     * @param id the id of the rdv to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rdv, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rdvs/{id}")
    public ResponseEntity<Rdv> getRdv(@PathVariable Long id) {
        log.debug("REST request to get Rdv : {}", id);
        Optional<Rdv> rdv = rdvRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(rdv);
    }

    /**
     * {@code DELETE  /rdvs/:id} : delete the "id" rdv.
     *
     * @param id the id of the rdv to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rdvs/{id}")
    public ResponseEntity<Void> deleteRdv(@PathVariable Long id) {
        log.debug("REST request to delete Rdv : {}", id);
        rdvRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
