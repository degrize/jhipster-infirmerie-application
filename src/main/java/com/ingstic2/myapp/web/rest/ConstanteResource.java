package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.Constante;
import com.ingstic2.myapp.repository.ConstanteRepository;
import com.ingstic2.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ingstic2.myapp.domain.Constante}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ConstanteResource {

    private final Logger log = LoggerFactory.getLogger(ConstanteResource.class);

    private static final String ENTITY_NAME = "constante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConstanteRepository constanteRepository;

    public ConstanteResource(ConstanteRepository constanteRepository) {
        this.constanteRepository = constanteRepository;
    }

    /**
     * {@code POST  /constantes} : Create a new constante.
     *
     * @param constante the constante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new constante, or with status {@code 400 (Bad Request)} if the constante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/constantes")
    public ResponseEntity<Constante> createConstante(@RequestBody Constante constante) throws URISyntaxException {
        log.debug("REST request to save Constante : {}", constante);
        if (constante.getId() != null) {
            throw new BadRequestAlertException("A new constante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Constante result = constanteRepository.save(constante);
        return ResponseEntity
            .created(new URI("/api/constantes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /constantes/:id} : Updates an existing constante.
     *
     * @param id the id of the constante to save.
     * @param constante the constante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated constante,
     * or with status {@code 400 (Bad Request)} if the constante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the constante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/constantes/{id}")
    public ResponseEntity<Constante> updateConstante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Constante constante
    ) throws URISyntaxException {
        log.debug("REST request to update Constante : {}, {}", id, constante);
        if (constante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, constante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!constanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Constante result = constanteRepository.save(constante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, constante.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /constantes/:id} : Partial updates given fields of an existing constante, field will ignore if it is null
     *
     * @param id the id of the constante to save.
     * @param constante the constante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated constante,
     * or with status {@code 400 (Bad Request)} if the constante is not valid,
     * or with status {@code 404 (Not Found)} if the constante is not found,
     * or with status {@code 500 (Internal Server Error)} if the constante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/constantes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Constante> partialUpdateConstante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Constante constante
    ) throws URISyntaxException {
        log.debug("REST request to partial update Constante partially : {}, {}", id, constante);
        if (constante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, constante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!constanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Constante> result = constanteRepository
            .findById(constante.getId())
            .map(existingConstante -> {
                if (constante.getMasse() != null) {
                    existingConstante.setMasse(constante.getMasse());
                }
                if (constante.getTemperature() != null) {
                    existingConstante.setTemperature(constante.getTemperature());
                }
                if (constante.getTaille() != null) {
                    existingConstante.setTaille(constante.getTaille());
                }
                if (constante.getPouls() != null) {
                    existingConstante.setPouls(constante.getPouls());
                }

                return existingConstante;
            })
            .map(constanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, constante.getId().toString())
        );
    }

    /**
     * {@code GET  /constantes} : get all the constantes.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of constantes in body.
     */
    @GetMapping("/constantes")
    public List<Constante> getAllConstantes(@RequestParam(required = false) String filter) {
        if ("consultation-is-null".equals(filter)) {
            log.debug("REST request to get all Constantes where consultation is null");
            return StreamSupport
                .stream(constanteRepository.findAll().spliterator(), false)
                .filter(constante -> constante.getConsultation() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Constantes");
        return constanteRepository.findAll();
    }

    /**
     * {@code GET  /constantes/:id} : get the "id" constante.
     *
     * @param id the id of the constante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the constante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/constantes/{id}")
    public ResponseEntity<Constante> getConstante(@PathVariable Long id) {
        log.debug("REST request to get Constante : {}", id);
        Optional<Constante> constante = constanteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(constante);
    }

    /**
     * {@code DELETE  /constantes/:id} : delete the "id" constante.
     *
     * @param id the id of the constante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/constantes/{id}")
    public ResponseEntity<Void> deleteConstante(@PathVariable Long id) {
        log.debug("REST request to delete Constante : {}", id);
        constanteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
