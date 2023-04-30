package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.AgentSante;
import com.ingstic2.myapp.repository.AgentSanteRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.AgentSante}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AgentSanteResource {

    private final Logger log = LoggerFactory.getLogger(AgentSanteResource.class);

    private static final String ENTITY_NAME = "agentSante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AgentSanteRepository agentSanteRepository;

    public AgentSanteResource(AgentSanteRepository agentSanteRepository) {
        this.agentSanteRepository = agentSanteRepository;
    }

    /**
     * {@code POST  /agent-santes} : Create a new agentSante.
     *
     * @param agentSante the agentSante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new agentSante, or with status {@code 400 (Bad Request)} if the agentSante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/agent-santes")
    public ResponseEntity<AgentSante> createAgentSante(@RequestBody AgentSante agentSante) throws URISyntaxException {
        log.debug("REST request to save AgentSante : {}", agentSante);
        if (agentSante.getId() != null) {
            throw new BadRequestAlertException("A new agentSante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AgentSante result = agentSanteRepository.save(agentSante);
        return ResponseEntity
            .created(new URI("/api/agent-santes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /agent-santes/:id} : Updates an existing agentSante.
     *
     * @param id the id of the agentSante to save.
     * @param agentSante the agentSante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentSante,
     * or with status {@code 400 (Bad Request)} if the agentSante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the agentSante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/agent-santes/{id}")
    public ResponseEntity<AgentSante> updateAgentSante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AgentSante agentSante
    ) throws URISyntaxException {
        log.debug("REST request to update AgentSante : {}, {}", id, agentSante);
        if (agentSante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentSante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentSanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AgentSante result = agentSanteRepository.save(agentSante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentSante.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /agent-santes/:id} : Partial updates given fields of an existing agentSante, field will ignore if it is null
     *
     * @param id the id of the agentSante to save.
     * @param agentSante the agentSante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentSante,
     * or with status {@code 400 (Bad Request)} if the agentSante is not valid,
     * or with status {@code 404 (Not Found)} if the agentSante is not found,
     * or with status {@code 500 (Internal Server Error)} if the agentSante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/agent-santes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AgentSante> partialUpdateAgentSante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AgentSante agentSante
    ) throws URISyntaxException {
        log.debug("REST request to partial update AgentSante partially : {}, {}", id, agentSante);
        if (agentSante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentSante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentSanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AgentSante> result = agentSanteRepository
            .findById(agentSante.getId())
            .map(existingAgentSante -> {
                if (agentSante.getNom() != null) {
                    existingAgentSante.setNom(agentSante.getNom());
                }
                if (agentSante.getPrenom() != null) {
                    existingAgentSante.setPrenom(agentSante.getPrenom());
                }
                if (agentSante.getContact() != null) {
                    existingAgentSante.setContact(agentSante.getContact());
                }
                if (agentSante.getAdresse() != null) {
                    existingAgentSante.setAdresse(agentSante.getAdresse());
                }
                if (agentSante.getLogin() != null) {
                    existingAgentSante.setLogin(agentSante.getLogin());
                }
                if (agentSante.getMotDePasse() != null) {
                    existingAgentSante.setMotDePasse(agentSante.getMotDePasse());
                }

                return existingAgentSante;
            })
            .map(agentSanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentSante.getId().toString())
        );
    }

    /**
     * {@code GET  /agent-santes} : get all the agentSantes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of agentSantes in body.
     */
    @GetMapping("/agent-santes")
    public List<AgentSante> getAllAgentSantes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all AgentSantes");
        if (eagerload) {
            return agentSanteRepository.findAllWithEagerRelationships();
        } else {
            return agentSanteRepository.findAll();
        }
    }

    /**
     * {@code GET  /agent-santes/:id} : get the "id" agentSante.
     *
     * @param id the id of the agentSante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the agentSante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/agent-santes/{id}")
    public ResponseEntity<AgentSante> getAgentSante(@PathVariable Long id) {
        log.debug("REST request to get AgentSante : {}", id);
        Optional<AgentSante> agentSante = agentSanteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(agentSante);
    }

    /**
     * {@code DELETE  /agent-santes/:id} : delete the "id" agentSante.
     *
     * @param id the id of the agentSante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/agent-santes/{id}")
    public ResponseEntity<Void> deleteAgentSante(@PathVariable Long id) {
        log.debug("REST request to delete AgentSante : {}", id);
        agentSanteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
