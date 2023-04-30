package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TypeConsultation.
 */
@Entity
@Table(name = "type_consultation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TypeConsultation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle_type_consultation")
    private String libelleTypeConsultation;

    @OneToMany(mappedBy = "typeConsultation")
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

    public TypeConsultation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelleTypeConsultation() {
        return this.libelleTypeConsultation;
    }

    public TypeConsultation libelleTypeConsultation(String libelleTypeConsultation) {
        this.setLibelleTypeConsultation(libelleTypeConsultation);
        return this;
    }

    public void setLibelleTypeConsultation(String libelleTypeConsultation) {
        this.libelleTypeConsultation = libelleTypeConsultation;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<Consultation> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setTypeConsultation(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setTypeConsultation(this));
        }
        this.consultations = consultations;
    }

    public TypeConsultation consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public TypeConsultation addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.setTypeConsultation(this);
        return this;
    }

    public TypeConsultation removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.setTypeConsultation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeConsultation)) {
            return false;
        }
        return id != null && id.equals(((TypeConsultation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeConsultation{" +
            "id=" + getId() +
            ", libelleTypeConsultation='" + getLibelleTypeConsultation() + "'" +
            "}";
    }
}
