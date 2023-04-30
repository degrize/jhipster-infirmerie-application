package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.CentreSante;
import com.ingstic2.myapp.repository.CentreSanteRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.CentreSante}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CentreSanteResource {

    private final Logger log = LoggerFactory.getLogger(CentreSanteResource.class);

    private static final String ENTITY_NAME = "centreSante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CentreSanteRepository centreSanteRepository;

    public CentreSanteResource(CentreSanteRepository centreSanteRepository) {
        this.centreSanteRepository = centreSanteRepository;
    }

    /**
     * {@code POST  /centre-santes} : Create a new centreSante.
     *
     * @param centreSante the centreSante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new centreSante, or with status {@code 400 (Bad Request)} if the centreSante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/centre-santes")
    public ResponseEntity<CentreSante> createCentreSante(@RequestBody CentreSante centreSante) throws URISyntaxException {
        log.debug("REST request to save CentreSante : {}", centreSante);
        if (centreSante.getId() != null) {
            throw new BadRequestAlertException("A new centreSante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CentreSante result = centreSanteRepository.save(centreSante);
        return ResponseEntity
            .created(new URI("/api/centre-santes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /centre-santes/:id} : Updates an existing centreSante.
     *
     * @param id the id of the centreSante to save.
     * @param centreSante the centreSante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated centreSante,
     * or with status {@code 400 (Bad Request)} if the centreSante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the centreSante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/centre-santes/{id}")
    public ResponseEntity<CentreSante> updateCentreSante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CentreSante centreSante
    ) throws URISyntaxException {
        log.debug("REST request to update CentreSante : {}, {}", id, centreSante);
        if (centreSante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, centreSante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!centreSanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CentreSante result = centreSanteRepository.save(centreSante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, centreSante.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /centre-santes/:id} : Partial updates given fields of an existing centreSante, field will ignore if it is null
     *
     * @param id the id of the centreSante to save.
     * @param centreSante the centreSante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated centreSante,
     * or with status {@code 400 (Bad Request)} if the centreSante is not valid,
     * or with status {@code 404 (Not Found)} if the centreSante is not found,
     * or with status {@code 500 (Internal Server Error)} if the centreSante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/centre-santes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CentreSante> partialUpdateCentreSante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CentreSante centreSante
    ) throws URISyntaxException {
        log.debug("REST request to partial update CentreSante partially : {}, {}", id, centreSante);
        if (centreSante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, centreSante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!centreSanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CentreSante> result = centreSanteRepository
            .findById(centreSante.getId())
            .map(existingCentreSante -> {
                if (centreSante.getNom() != null) {
                    existingCentreSante.setNom(centreSante.getNom());
                }
                if (centreSante.getAdresse() != null) {
                    existingCentreSante.setAdresse(centreSante.getAdresse());
                }
                if (centreSante.getContact() != null) {
                    existingCentreSante.setContact(centreSante.getContact());
                }
                if (centreSante.getEmail() != null) {
                    existingCentreSante.setEmail(centreSante.getEmail());
                }
                if (centreSante.getNumeroMatriculation() != null) {
                    existingCentreSante.setNumeroMatriculation(centreSante.getNumeroMatriculation());
                }

                return existingCentreSante;
            })
            .map(centreSanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, centreSante.getId().toString())
        );
    }

    /**
     * {@code GET  /centre-santes} : get all the centreSantes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of centreSantes in body.
     */
    @GetMapping("/centre-santes")
    public List<CentreSante> getAllCentreSantes() {
        log.debug("REST request to get all CentreSantes");
        return centreSanteRepository.findAll();
    }

    /**
     * {@code GET  /centre-santes/:id} : get the "id" centreSante.
     *
     * @param id the id of the centreSante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the centreSante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/centre-santes/{id}")
    public ResponseEntity<CentreSante> getCentreSante(@PathVariable Long id) {
        log.debug("REST request to get CentreSante : {}", id);
        Optional<CentreSante> centreSante = centreSanteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(centreSante);
    }

    /**
     * {@code DELETE  /centre-santes/:id} : delete the "id" centreSante.
     *
     * @param id the id of the centreSante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/centre-santes/{id}")
    public ResponseEntity<Void> deleteCentreSante(@PathVariable Long id) {
        log.debug("REST request to delete CentreSante : {}", id);
        centreSanteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
