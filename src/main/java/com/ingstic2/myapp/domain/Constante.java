package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Constante.
 */
@Entity
@Table(name = "constante")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Constante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "masse")
    private Double masse;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "taille")
    private Double taille;

    @Column(name = "pouls")
    private Integer pouls;

    @JsonIgnoreProperties(
        value = { "constante", "patient", "agentSante", "rdv", "ordonnance", "typeConsultation", "examen", "consultations", "pathologies" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "constante")
    private Consultation consultation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Constante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMasse() {
        return this.masse;
    }

    public Constante masse(Double masse) {
        this.setMasse(masse);
        return this;
    }

    public void setMasse(Double masse) {
        this.masse = masse;
    }

    public Double getTemperature() {
        return this.temperature;
    }

    public Constante temperature(Double temperature) {
        this.setTemperature(temperature);
        return this;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getTaille() {
        return this.taille;
    }

    public Constante taille(Double taille) {
        this.setTaille(taille);
        return this;
    }

    public void setTaille(Double taille) {
        this.taille = taille;
    }

    public Integer getPouls() {
        return this.pouls;
    }

    public Constante pouls(Integer pouls) {
        this.setPouls(pouls);
        return this;
    }

    public void setPouls(Integer pouls) {
        this.pouls = pouls;
    }

    public Consultation getConsultation() {
        return this.consultation;
    }

    public void setConsultation(Consultation consultation) {
        if (this.consultation != null) {
            this.consultation.setConstante(null);
        }
        if (consultation != null) {
            consultation.setConstante(this);
        }
        this.consultation = consultation;
    }

    public Constante consultation(Consultation consultation) {
        this.setConsultation(consultation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Constante)) {
            return false;
        }
        return id != null && id.equals(((Constante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Constante{" +
            "id=" + getId() +
            ", masse=" + getMasse() +
            ", temperature=" + getTemperature() +
            ", taille=" + getTaille() +
            ", pouls=" + getPouls() +
            "}";
    }
}
