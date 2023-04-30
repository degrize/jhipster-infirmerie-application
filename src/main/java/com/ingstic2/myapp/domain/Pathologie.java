package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pathologie.
 */
@Entity
@Table(name = "pathologie")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pathologie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle_pathologie")
    private String libellePathologie;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pathologies" }, allowSetters = true)
    private TypePathologie typePathologie;

    @ManyToMany
    @JoinTable(
        name = "rel_pathologie__consultation",
        joinColumns = @JoinColumn(name = "pathologie_id"),
        inverseJoinColumns = @JoinColumn(name = "consultation_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "constante", "patient", "agentSante", "rdv", "ordonnance", "typeConsultation", "examen", "consultations", "pathologies" },
        allowSetters = true
    )
    private Set<Consultation> consultations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pathologie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibellePathologie() {
        return this.libellePathologie;
    }

    public Pathologie libellePathologie(String libellePathologie) {
        this.setLibellePathologie(libellePathologie);
        return this;
    }

    public void setLibellePathologie(String libellePathologie) {
        this.libellePathologie = libellePathologie;
    }

    public TypePathologie getTypePathologie() {
        return this.typePathologie;
    }

    public void setTypePathologie(TypePathologie typePathologie) {
        this.typePathologie = typePathologie;
    }

    public Pathologie typePathologie(TypePathologie typePathologie) {
        this.setTypePathologie(typePathologie);
        return this;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<Consultation> consultations) {
        this.consultations = consultations;
    }

    public Pathologie consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public Pathologie addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.getPathologies().add(this);
        return this;
    }

    public Pathologie removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.getPathologies().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pathologie)) {
            return false;
        }
        return id != null && id.equals(((Pathologie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pathologie{" +
            "id=" + getId() +
            ", libellePathologie='" + getLibellePathologie() + "'" +
            "}";
    }
}
