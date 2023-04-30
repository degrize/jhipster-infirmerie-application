package com.ingstic2.myapp.web.rest;

import com.ingstic2.myapp.domain.TypeAgent;
import com.ingstic2.myapp.repository.TypeAgentRepository;
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
 * REST controller for managing {@link com.ingstic2.myapp.domain.TypeAgent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypeAgentResource {

    private final Logger log = LoggerFactory.getLogger(TypeAgentResource.class);

    private static final String ENTITY_NAME = "typeAgent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeAgentRepository typeAgentRepository;

    public TypeAgentResource(TypeAgentRepository typeAgentRepository) {
        this.typeAgentRepository = typeAgentRepository;
    }

    /**
     * {@code POST  /type-agents} : Create a new typeAgent.
     *
     * @param typeAgent the typeAgent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeAgent, or with status {@code 400 (Bad Request)} if the typeAgent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-agents")
    public ResponseEntity<TypeAgent> createTypeAgent(@RequestBody TypeAgent typeAgent) throws URISyntaxException {
        log.debug("REST request to save TypeAgent : {}", typeAgent);
        if (typeAgent.getId() != null) {
            throw new BadRequestAlertException("A new typeAgent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeAgent result = typeAgentRepository.save(typeAgent);
        return ResponseEntity
            .created(new URI("/api/type-agents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-agents/:id} : Updates an existing typeAgent.
     *
     * @param id the id of the typeAgent to save.
     * @param typeAgent the typeAgent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeAgent,
     * or with status {@code 400 (Bad Request)} if the typeAgent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeAgent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-agents/{id}")
    public ResponseEntity<TypeAgent> updateTypeAgent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeAgent typeAgent
    ) throws URISyntaxException {
        log.debug("REST request to update TypeAgent : {}, {}", id, typeAgent);
        if (typeAgent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeAgent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeAgentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeAgent result = typeAgentRepository.save(typeAgent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeAgent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-agents/:id} : Partial updates given fields of an existing typeAgent, field will ignore if it is null
     *
     * @param id the id of the typeAgent to save.
     * @param typeAgent the typeAgent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeAgent,
     * or with status {@code 400 (Bad Request)} if the typeAgent is not valid,
     * or with status {@code 404 (Not Found)} if the typeAgent is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeAgent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-agents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeAgent> partialUpdateTypeAgent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeAgent typeAgent
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeAgent partially : {}, {}", id, typeAgent);
        if (typeAgent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeAgent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeAgentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeAgent> result = typeAgentRepository
            .findById(typeAgent.getId())
            .map(existingTypeAgent -> {
                if (typeAgent.getTypeAgent() != null) {
                    existingTypeAgent.setTypeAgent(typeAgent.getTypeAgent());
                }

                return existingTypeAgent;
            })
            .map(typeAgentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeAgent.getId().toString())
        );
    }

    /**
     * {@code GET  /type-agents} : get all the typeAgents.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeAgents in body.
     */
    @GetMapping("/type-agents")
    public List<TypeAgent> getAllTypeAgents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TypeAgents");
        if (eagerload) {
            return typeAgentRepository.findAllWithEagerRelationships();
        } else {
            return typeAgentRepository.findAll();
        }
    }

    /**
     * {@code GET  /type-agents/:id} : get the "id" typeAgent.
     *
     * @param id the id of the typeAgent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeAgent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-agents/{id}")
    public ResponseEntity<TypeAgent> getTypeAgent(@PathVariable Long id) {
        log.debug("REST request to get TypeAgent : {}", id);
        Optional<TypeAgent> typeAgent = typeAgentRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(typeAgent);
    }

    /**
     * {@code DELETE  /type-agents/:id} : delete the "id" typeAgent.
     *
     * @param id the id of the typeAgent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-agents/{id}")
    public ResponseEntity<Void> deleteTypeAgent(@PathVariable Long id) {
        log.debug("REST request to delete TypeAgent : {}", id);
        typeAgentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
