package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Specialite;
import com.ingstic2.myapp.repository.SpecialiteRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.Specialite}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SpecialiteResource {

    private final Logger log = LoggerFactory.getLogger(SpecialiteResource.class);

    private static final String ENTITY_NAME = "specialite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SpecialiteRepository specialiteRepository;

    public SpecialiteResource(SpecialiteRepository specialiteRepository) {
        this.specialiteRepository = specialiteRepository;
    }

    /**
     * {@code POST  /specialites} : Create a new specialite.
     *
     * @param specialite the specialite to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new specialite, or with status {@code 400 (Bad Request)} if the specialite has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/specialites")
    public ResponseEntity<Specialite> createSpecialite(@RequestBody Specialite specialite) throws URISyntaxException {
        log.debug("REST request to save Specialite : {}", specialite);
        if (specialite.getId() != null) {
            throw new BadRequestAlertException("A new specialite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Specialite result = specialiteRepository.save(specialite);
        return ResponseEntity
            .created(new URI("/api/specialites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /specialites/:id} : Updates an existing specialite.
     *
     * @param id the id of the specialite to save.
     * @param specialite the specialite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated specialite,
     * or with status {@code 400 (Bad Request)} if the specialite is not valid,
     * or with status {@code 500 (Internal Server Error)} if the specialite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/specialites/{id}")
    public ResponseEntity<Specialite> updateSpecialite(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Specialite specialite
    ) throws URISyntaxException {
        log.debug("REST request to update Specialite : {}, {}", id, specialite);
        if (specialite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, specialite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!specialiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Specialite result = specialiteRepository.save(specialite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, specialite.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /specialites/:id} : Partial updates given fields of an existing specialite, field will ignore if it is null
     *
     * @param id the id of the specialite to save.
     * @param specialite the specialite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated specialite,
     * or with status {@code 400 (Bad Request)} if the specialite is not valid,
     * or with status {@code 404 (Not Found)} if the specialite is not found,
     * or with status {@code 500 (Internal Server Error)} if the specialite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/specialites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Specialite> partialUpdateSpecialite(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Specialite specialite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Specialite partially : {}, {}", id, specialite);
        if (specialite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, specialite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!specialiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Specialite> result = specialiteRepository
            .findById(specialite.getId())
            .map(existingSpecialite -> {
                if (specialite.getSpecialite() != null) {
                    existingSpecialite.setSpecialite(specialite.getSpecialite());
                }

                return existingSpecialite;
            })
            .map(specialiteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, specialite.getId().toString())
        );
    }

    /**
     * {@code GET  /specialites} : get all the specialites.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of specialites in body.
     */
    @GetMapping("/specialites")
    public List<Specialite> getAllSpecialites() {
        log.debug("REST request to get all Specialites");
        return specialiteRepository.findAll();
    }

    /**
     * {@code GET  /specialites/:id} : get the "id" specialite.
     *
     * @param id the id of the specialite to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the specialite, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/specialites/{id}")
    public ResponseEntity<Specialite> getSpecialite(@PathVariable Long id) {
        log.debug("REST request to get Specialite : {}", id);
        Optional<Specialite> specialite = specialiteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(specialite);
    }

    /**
     * {@code DELETE  /specialites/:id} : delete the "id" specialite.
     *
     * @param id the id of the specialite to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/specialites/{id}")
    public ResponseEntity<Void> deleteSpecialite(@PathVariable Long id) {
        log.debug("REST request to delete Specialite : {}", id);
        specialiteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
