package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Specialite.
 */
@Entity
@Table(name = "specialite")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Specialite implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "specialite")
    private String specialite;

    @ManyToMany(mappedBy = "specialites")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeAgents", "specialites", "consultations" }, allowSetters = true)
    private Set<AgentSante> agentSantes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Specialite id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecialite() {
        return this.specialite;
    }

    public Specialite specialite(String specialite) {
        this.setSpecialite(specialite);
        return this;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public Set<AgentSante> getAgentSantes() {
        return this.agentSantes;
    }

    public void setAgentSantes(Set<AgentSante> agentSantes) {
        if (this.agentSantes != null) {
            this.agentSantes.forEach(i -> i.removeSpecialite(this));
        }
        if (agentSantes != null) {
            agentSantes.forEach(i -> i.addSpecialite(this));
        }
        this.agentSantes = agentSantes;
    }

    public Specialite agentSantes(Set<AgentSante> agentSantes) {
        this.setAgentSantes(agentSantes);
        return this;
    }

    public Specialite addAgentSante(AgentSante agentSante) {
        this.agentSantes.add(agentSante);
        agentSante.getSpecialites().add(this);
        return this;
    }

    public Specialite removeAgentSante(AgentSante agentSante) {
        this.agentSantes.remove(agentSante);
        agentSante.getSpecialites().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Specialite)) {
            return false;
        }
        return id != null && id.equals(((Specialite) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Specialite{" +
            "id=" + getId() +
            ", specialite='" + getSpecialite() + "'" +
            "}";
    }
}
