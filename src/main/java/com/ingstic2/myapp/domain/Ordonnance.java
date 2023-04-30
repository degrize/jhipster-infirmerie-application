package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ordonnance.
 */
@Entity
@Table(name = "ordonnance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ordonnance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ordonnance_description")
    private String ordonnanceDescription;

    @OneToMany(mappedBy = "ordonnance")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "constante", "patient", "agentSante", "rdv", "ordonnance", "typeConsultation", "examen", "consultations", "pathologies" },
        allowSetters = true
    )
    private Set<Consultation> consultations = new HashSet<>();

    @OneToMany(mappedBy = "ordonnance")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeMedicament", "ordonnance" }, allowSetters = true)
    private Set<Medicament> medicaments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ordonnance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrdonnanceDescription() {
        return this.ordonnanceDescription;
    }

    public Ordonnance ordonnanceDescription(String ordonnanceDescription) {
        this.setOrdonnanceDescription(ordonnanceDescription);
        return this;
    }

    public void setOrdonnanceDescription(String ordonnanceDescription) {
        this.ordonnanceDescription = ordonnanceDescription;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<Consultation> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setOrdonnance(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setOrdonnance(this));
        }
        this.consultations = consultations;
    }

    public Ordonnance consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public Ordonnance addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.setOrdonnance(this);
        return this;
    }

    public Ordonnance removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.setOrdonnance(null);
        return this;
    }

    public Set<Medicament> getMedicaments() {
        return this.medicaments;
    }

    public void setMedicaments(Set<Medicament> medicaments) {
        if (this.medicaments != null) {
            this.medicaments.forEach(i -> i.setOrdonnance(null));
        }
        if (medicaments != null) {
            medicaments.forEach(i -> i.setOrdonnance(this));
        }
        this.medicaments = medicaments;
    }

    public Ordonnance medicaments(Set<Medicament> medicaments) {
        this.setMedicaments(medicaments);
        return this;
    }

    public Ordonnance addMedicament(Medicament medicament) {
        this.medicaments.add(medicament);
        medicament.setOrdonnance(this);
        return this;
    }

    public Ordonnance removeMedicament(Medicament medicament) {
        this.medicaments.remove(medicament);
        medicament.setOrdonnance(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ordonnance)) {
            return false;
        }
        return id != null && id.equals(((Ordonnance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ordonnance{" +
            "id=" + getId() +
            ", ordonnanceDescription='" + getOrdonnanceDescription() + "'" +
            "}";
    }
}
