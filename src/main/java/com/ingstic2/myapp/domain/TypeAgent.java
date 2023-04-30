package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TypeAgent.
 */
@Entity
@Table(name = "type_agent")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TypeAgent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "type_agent")
    private String typeAgent;

    @ManyToOne
    @JsonIgnoreProperties(value = { "typeAgents", "specialites", "consultations" }, allowSetters = true)
    private AgentSante agentSante;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypeAgent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeAgent() {
        return this.typeAgent;
    }

    public TypeAgent typeAgent(String typeAgent) {
        this.setTypeAgent(typeAgent);
        return this;
    }

    public void setTypeAgent(String typeAgent) {
        this.typeAgent = typeAgent;
    }

    public AgentSante getAgentSante() {
        return this.agentSante;
    }

    public void setAgentSante(AgentSante agentSante) {
        this.agentSante = agentSante;
    }

    public TypeAgent agentSante(AgentSante agentSante) {
        this.setAgentSante(agentSante);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeAgent)) {
            return false;
        }
        return id != null && id.equals(((TypeAgent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeAgent{" +
            "id=" + getId() +
            ", typeAgent='" + getTypeAgent() + "'" +
            "}";
    }
}
