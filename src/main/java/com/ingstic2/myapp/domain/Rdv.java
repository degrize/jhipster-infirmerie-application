package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Rdv.
 */
@Entity
@Table(name = "rdv")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Rdv implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date_rdv")
    private LocalDate dateRdv;

    @Column(name = "motif")
    private String motif;

    @JsonIgnoreProperties(
        value = { "constante", "patient", "agentSante", "rdv", "ordonnance", "typeConsultation", "examen", "consultations", "pathologies" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Consultation consultation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Rdv id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateRdv() {
        return this.dateRdv;
    }

    public Rdv dateRdv(LocalDate dateRdv) {
        this.setDateRdv(dateRdv);
        return this;
    }

    public void setDateRdv(LocalDate dateRdv) {
        this.dateRdv = dateRdv;
    }

    public String getMotif() {
        return this.motif;
    }

    public Rdv motif(String motif) {
        this.setMotif(motif);
        return this;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public Consultation getConsultation() {
        return this.consultation;
    }

    public void setConsultation(Consultation consultation) {
        this.consultation = consultation;
    }

    public Rdv consultation(Consultation consultation) {
        this.setConsultation(consultation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rdv)) {
            return false;
        }
        return id != null && id.equals(((Rdv) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rdv{" +
            "id=" + getId() +
            ", dateRdv='" + getDateRdv() + "'" +
            ", motif='" + getMotif() + "'" +
            "}";
    }
}
