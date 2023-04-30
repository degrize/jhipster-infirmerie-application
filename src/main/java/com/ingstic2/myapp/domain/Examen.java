package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Examen.
 */
@Entity
@Table(name = "examen")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Examen implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "examen_libelle")
    private String examenLibelle;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "constante", "patient", "agentSante", "rdv", "ordonnance", "typeConsultation", "examen", "consultations", "pathologies" },
        allowSetters = true
    )
    private Consultation consultation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Examen id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExamenLibelle() {
        return this.examenLibelle;
    }

    public Examen examenLibelle(String examenLibelle) {
        this.setExamenLibelle(examenLibelle);
        return this;
    }

    public void setExamenLibelle(String examenLibelle) {
        this.examenLibelle = examenLibelle;
    }

    public Consultation getConsultation() {
        return this.consultation;
    }

    public void setConsultation(Consultation consultation) {
        this.consultation = consultation;
    }

    public Examen consultation(Consultation consultation) {
        this.setConsultation(consultation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Examen)) {
            return false;
        }
        return id != null && id.equals(((Examen) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Examen{" +
            "id=" + getId() +
            ", examenLibelle='" + getExamenLibelle() + "'" +
            "}";
    }
}
