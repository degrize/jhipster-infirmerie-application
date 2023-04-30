package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.MiseEnObservation;
import com.ingstic2.myapp.repository.MiseEnObservationRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.MiseEnObservation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MiseEnObservationResource {

    private final Logger log = LoggerFactory.getLogger(MiseEnObservationResource.class);

    private static final String ENTITY_NAME = "miseEnObservation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MiseEnObservationRepository miseEnObservationRepository;

    public MiseEnObservationResource(MiseEnObservationRepository miseEnObservationRepository) {
        this.miseEnObservationRepository = miseEnObservationRepository;
    }

    /**
     * {@code POST  /mise-en-observations} : Create a new miseEnObservation.
     *
     * @param miseEnObservation the miseEnObservation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new miseEnObservation, or with status {@code 400 (Bad Request)} if the miseEnObservation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mise-en-observations")
    public ResponseEntity<MiseEnObservation> createMiseEnObservation(@RequestBody MiseEnObservation miseEnObservation)
        throws URISyntaxException {
        log.debug("REST request to save MiseEnObservation : {}", miseEnObservation);
        if (miseEnObservation.getId() != null) {
            throw new BadRequestAlertException("A new miseEnObservation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MiseEnObservation result = miseEnObservationRepository.save(miseEnObservation);
        return ResponseEntity
            .created(new URI("/api/mise-en-observations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mise-en-observations/:id} : Updates an existing miseEnObservation.
     *
     * @param id the id of the miseEnObservation to save.
     * @param miseEnObservation the miseEnObservation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated miseEnObservation,
     * or with status {@code 400 (Bad Request)} if the miseEnObservation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the miseEnObservation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mise-en-observations/{id}")
    public ResponseEntity<MiseEnObservation> updateMiseEnObservation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MiseEnObservation miseEnObservation
    ) throws URISyntaxException {
        log.debug("REST request to update MiseEnObservation : {}, {}", id, miseEnObservation);
        if (miseEnObservation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, miseEnObservation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!miseEnObservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MiseEnObservation result = miseEnObservationRepository.save(miseEnObservation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, miseEnObservation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mise-en-observations/:id} : Partial updates given fields of an existing miseEnObservation, field will ignore if it is null
     *
     * @param id the id of the miseEnObservation to save.
     * @param miseEnObservation the miseEnObservation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated miseEnObservation,
     * or with status {@code 400 (Bad Request)} if the miseEnObservation is not valid,
     * or with status {@code 404 (Not Found)} if the miseEnObservation is not found,
     * or with status {@code 500 (Internal Server Error)} if the miseEnObservation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mise-en-observations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MiseEnObservation> partialUpdateMiseEnObservation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MiseEnObservation miseEnObservation
    ) throws URISyntaxException {
        log.debug("REST request to partial update MiseEnObservation partially : {}, {}", id, miseEnObservation);
        if (miseEnObservation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, miseEnObservation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!miseEnObservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MiseEnObservation> result = miseEnObservationRepository
            .findById(miseEnObservation.getId())
            .map(existingMiseEnObservation -> {
                if (miseEnObservation.getDateDebut() != null) {
                    existingMiseEnObservation.setDateDebut(miseEnObservation.getDateDebut());
                }
                if (miseEnObservation.getDateFin() != null) {
                    existingMiseEnObservation.setDateFin(miseEnObservation.getDateFin());
                }
                if (miseEnObservation.getDescription() != null) {
                    existingMiseEnObservation.setDescription(miseEnObservation.getDescription());
                }

                return existingMiseEnObservation;
            })
            .map(miseEnObservationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, miseEnObservation.getId().toString())
        );
    }

    /**
     * {@code GET  /mise-en-observations} : get all the miseEnObservations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of miseEnObservations in body.
     */
    @GetMapping("/mise-en-observations")
    public List<MiseEnObservation> getAllMiseEnObservations(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all MiseEnObservations");
        if (eagerload) {
            return miseEnObservationRepository.findAllWithEagerRelationships();
        } else {
            return miseEnObservationRepository.findAll();
        }
    }

    /**
     * {@code GET  /mise-en-observations/:id} : get the "id" miseEnObservation.
     *
     * @param id the id of the miseEnObservation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the miseEnObservation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mise-en-observations/{id}")
    public ResponseEntity<MiseEnObservation> getMiseEnObservation(@PathVariable Long id) {
        log.debug("REST request to get MiseEnObservation : {}", id);
        Optional<MiseEnObservation> miseEnObservation = miseEnObservationRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(miseEnObservation);
    }

    /**
     * {@code DELETE  /mise-en-observations/:id} : delete the "id" miseEnObservation.
     *
     * @param id the id of the miseEnObservation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mise-en-observations/{id}")
    public ResponseEntity<Void> deleteMiseEnObservation(@PathVariable Long id) {
        log.debug("REST request to delete MiseEnObservation : {}", id);
        miseEnObservationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
