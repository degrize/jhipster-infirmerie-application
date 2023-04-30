package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.TypeMedicament;
import com.ingstic2.myapp.repository.TypeMedicamentRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.TypeMedicament}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypeMedicamentResource {

    private final Logger log = LoggerFactory.getLogger(TypeMedicamentResource.class);

    private static final String ENTITY_NAME = "typeMedicament";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeMedicamentRepository typeMedicamentRepository;

    public TypeMedicamentResource(TypeMedicamentRepository typeMedicamentRepository) {
        this.typeMedicamentRepository = typeMedicamentRepository;
    }

    /**
     * {@code POST  /type-medicaments} : Create a new typeMedicament.
     *
     * @param typeMedicament the typeMedicament to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeMedicament, or with status {@code 400 (Bad Request)} if the typeMedicament has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-medicaments")
    public ResponseEntity<TypeMedicament> createTypeMedicament(@RequestBody TypeMedicament typeMedicament) throws URISyntaxException {
        log.debug("REST request to save TypeMedicament : {}", typeMedicament);
        if (typeMedicament.getId() != null) {
            throw new BadRequestAlertException("A new typeMedicament cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeMedicament result = typeMedicamentRepository.save(typeMedicament);
        return ResponseEntity
            .created(new URI("/api/type-medicaments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-medicaments/:id} : Updates an existing typeMedicament.
     *
     * @param id the id of the typeMedicament to save.
     * @param typeMedicament the typeMedicament to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeMedicament,
     * or with status {@code 400 (Bad Request)} if the typeMedicament is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeMedicament couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-medicaments/{id}")
    public ResponseEntity<TypeMedicament> updateTypeMedicament(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeMedicament typeMedicament
    ) throws URISyntaxException {
        log.debug("REST request to update TypeMedicament : {}, {}", id, typeMedicament);
        if (typeMedicament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeMedicament.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeMedicamentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeMedicament result = typeMedicamentRepository.save(typeMedicament);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeMedicament.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-medicaments/:id} : Partial updates given fields of an existing typeMedicament, field will ignore if it is null
     *
     * @param id the id of the typeMedicament to save.
     * @param typeMedicament the typeMedicament to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeMedicament,
     * or with status {@code 400 (Bad Request)} if the typeMedicament is not valid,
     * or with status {@code 404 (Not Found)} if the typeMedicament is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeMedicament couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-medicaments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeMedicament> partialUpdateTypeMedicament(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeMedicament typeMedicament
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeMedicament partially : {}, {}", id, typeMedicament);
        if (typeMedicament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeMedicament.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeMedicamentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeMedicament> result = typeMedicamentRepository
            .findById(typeMedicament.getId())
            .map(existingTypeMedicament -> {
                if (typeMedicament.getTypeMedicament() != null) {
                    existingTypeMedicament.setTypeMedicament(typeMedicament.getTypeMedicament());
                }

                return existingTypeMedicament;
            })
            .map(typeMedicamentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeMedicament.getId().toString())
        );
    }

    /**
     * {@code GET  /type-medicaments} : get all the typeMedicaments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeMedicaments in body.
     */
    @GetMapping("/type-medicaments")
    public List<TypeMedicament> getAllTypeMedicaments() {
        log.debug("REST request to get all TypeMedicaments");
        return typeMedicamentRepository.findAll();
    }

    /**
     * {@code GET  /type-medicaments/:id} : get the "id" typeMedicament.
     *
     * @param id the id of the typeMedicament to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeMedicament, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-medicaments/{id}")
    public ResponseEntity<TypeMedicament> getTypeMedicament(@PathVariable Long id) {
        log.debug("REST request to get TypeMedicament : {}", id);
        Optional<TypeMedicament> typeMedicament = typeMedicamentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typeMedicament);
    }

    /**
     * {@code DELETE  /type-medicaments/:id} : delete the "id" typeMedicament.
     *
     * @param id the id of the typeMedicament to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-medicaments/{id}")
    public ResponseEntity<Void> deleteTypeMedicament(@PathVariable Long id) {
        log.debug("REST request to delete TypeMedicament : {}", id);
        typeMedicamentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
