package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.TypePathologie;
import com.ingstic2.myapp.repository.TypePathologieRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.TypePathologie}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypePathologieResource {

    private final Logger log = LoggerFactory.getLogger(TypePathologieResource.class);

    private static final String ENTITY_NAME = "typePathologie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypePathologieRepository typePathologieRepository;

    public TypePathologieResource(TypePathologieRepository typePathologieRepository) {
        this.typePathologieRepository = typePathologieRepository;
    }

    /**
     * {@code POST  /type-pathologies} : Create a new typePathologie.
     *
     * @param typePathologie the typePathologie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typePathologie, or with status {@code 400 (Bad Request)} if the typePathologie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-pathologies")
    public ResponseEntity<TypePathologie> createTypePathologie(@RequestBody TypePathologie typePathologie) throws URISyntaxException {
        log.debug("REST request to save TypePathologie : {}", typePathologie);
        if (typePathologie.getId() != null) {
            throw new BadRequestAlertException("A new typePathologie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypePathologie result = typePathologieRepository.save(typePathologie);
        return ResponseEntity
            .created(new URI("/api/type-pathologies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-pathologies/:id} : Updates an existing typePathologie.
     *
     * @param id the id of the typePathologie to save.
     * @param typePathologie the typePathologie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typePathologie,
     * or with status {@code 400 (Bad Request)} if the typePathologie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typePathologie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-pathologies/{id}")
    public ResponseEntity<TypePathologie> updateTypePathologie(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypePathologie typePathologie
    ) throws URISyntaxException {
        log.debug("REST request to update TypePathologie : {}, {}", id, typePathologie);
        if (typePathologie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typePathologie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typePathologieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypePathologie result = typePathologieRepository.save(typePathologie);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typePathologie.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-pathologies/:id} : Partial updates given fields of an existing typePathologie, field will ignore if it is null
     *
     * @param id the id of the typePathologie to save.
     * @param typePathologie the typePathologie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typePathologie,
     * or with status {@code 400 (Bad Request)} if the typePathologie is not valid,
     * or with status {@code 404 (Not Found)} if the typePathologie is not found,
     * or with status {@code 500 (Internal Server Error)} if the typePathologie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-pathologies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypePathologie> partialUpdateTypePathologie(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypePathologie typePathologie
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypePathologie partially : {}, {}", id, typePathologie);
        if (typePathologie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typePathologie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typePathologieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypePathologie> result = typePathologieRepository
            .findById(typePathologie.getId())
            .map(existingTypePathologie -> {
                if (typePathologie.getTypePathologie() != null) {
                    existingTypePathologie.setTypePathologie(typePathologie.getTypePathologie());
                }

                return existingTypePathologie;
            })
            .map(typePathologieRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typePathologie.getId().toString())
        );
    }

    /**
     * {@code GET  /type-pathologies} : get all the typePathologies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typePathologies in body.
     */
    @GetMapping("/type-pathologies")
    public List<TypePathologie> getAllTypePathologies() {
        log.debug("REST request to get all TypePathologies");
        return typePathologieRepository.findAll();
    }

    /**
     * {@code GET  /type-pathologies/:id} : get the "id" typePathologie.
     *
     * @param id the id of the typePathologie to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typePathologie, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-pathologies/{id}")
    public ResponseEntity<TypePathologie> getTypePathologie(@PathVariable Long id) {
        log.debug("REST request to get TypePathologie : {}", id);
        Optional<TypePathologie> typePathologie = typePathologieRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typePathologie);
    }

    /**
     * {@code DELETE  /type-pathologies/:id} : delete the "id" typePathologie.
     *
     * @param id the id of the typePathologie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-pathologies/{id}")
    public ResponseEntity<Void> deleteTypePathologie(@PathVariable Long id) {
        log.debug("REST request to delete TypePathologie : {}", id);
        typePathologieRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
