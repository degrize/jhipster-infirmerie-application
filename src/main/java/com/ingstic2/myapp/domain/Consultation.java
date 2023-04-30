package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consultation.
 */
@Entity
@Table(name = "consultation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Consultation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date_consultation")
    private LocalDate dateConsultation;

    @Column(name = "motif")
    private String motif;

    @Column(name = "diagnostic")
    private String diagnostic;

    @Column(name = "consultation_observation")
    private String consultationObservation;

    @JsonIgnoreProperties(value = { "consultation" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Constante constante;

    @ManyToOne
    @JsonIgnoreProperties(value = { "antecedents", "etudiant", "personnel", "consultations" }, allowSetters = true)
    private Patient patient;

    @ManyToOne
    @JsonIgnoreProperties(value = { "typeAgents", "specialites", "consultations" }, allowSetters = true)
    private AgentSante agentSante;

    @JsonIgnoreProperties(value = { "consultation" }, allowSetters = true)
    @OneToOne(mappedBy = "consultation")
    private Rdv rdv;

    @ManyToOne
    @JsonIgnoreProperties(value = { "consultations", "medicaments" }, allowSetters = true)
    private Ordonnance ordonnance;

    @ManyToOne
    @JsonIgnoreProperties(value = { "consultations" }, allowSetters = true)
    private TypeConsultation typeConsultation;

    @OneToMany(mappedBy = "consultation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consultation" }, allowSetters = true)
    private Set<Examen> examen = new HashSet<>();

    @OneToMany(mappedBy = "miseEnObservation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "miseEnObservation" }, allowSetters = true)
    private Set<MiseEnObservation> consultations = new HashSet<>();

    @ManyToMany(mappedBy = "consultations")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typePathologie", "consultations" }, allowSetters = true)
    private Set<Pathologie> pathologies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Consultation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateConsultation() {
        return this.dateConsultation;
    }

    public Consultation dateConsultation(LocalDate dateConsultation) {
        this.setDateConsultation(dateConsultation);
        return this;
    }

    public void setDateConsultation(LocalDate dateConsultation) {
        this.dateConsultation = dateConsultation;
    }

    public String getMotif() {
        return this.motif;
    }

    public Consultation motif(String motif) {
        this.setMotif(motif);
        return this;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public String getDiagnostic() {
        return this.diagnostic;
    }

    public Consultation diagnostic(String diagnostic) {
        this.setDiagnostic(diagnostic);
        return this;
    }

    public void setDiagnostic(String diagnostic) {
        this.diagnostic = diagnostic;
    }

    public String getConsultationObservation() {
        return this.consultationObservation;
    }

    public Consultation consultationObservation(String consultationObservation) {
        this.setConsultationObservation(consultationObservation);
        return this;
    }

    public void setConsultationObservation(String consultationObservation) {
        this.consultationObservation = consultationObservation;
    }

    public Constante getConstante() {
        return this.constante;
    }

    public void setConstante(Constante constante) {
        this.constante = constante;
    }

    public Consultation constante(Constante constante) {
        this.setConstante(constante);
        return this;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Consultation patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public AgentSante getAgentSante() {
        return this.agentSante;
    }

    public void setAgentSante(AgentSante agentSante) {
        this.agentSante = agentSante;
    }

    public Consultation agentSante(AgentSante agentSante) {
        this.setAgentSante(agentSante);
        return this;
    }

    public Rdv getRdv() {
        return this.rdv;
    }

    public void setRdv(Rdv rdv) {
        if (this.rdv != null) {
            this.rdv.setConsultation(null);
        }
        if (rdv != null) {
            rdv.setConsultation(this);
        }
        this.rdv = rdv;
    }

    public Consultation rdv(Rdv rdv) {
        this.setRdv(rdv);
        return this;
    }

    public Ordonnance getOrdonnance() {
        return this.ordonnance;
    }

    public void setOrdonnance(Ordonnance ordonnance) {
        this.ordonnance = ordonnance;
    }

    public Consultation ordonnance(Ordonnance ordonnance) {
        this.setOrdonnance(ordonnance);
        return this;
    }

    public TypeConsultation getTypeConsultation() {
        return this.typeConsultation;
    }

    public void setTypeConsultation(TypeConsultation typeConsultation) {
        this.typeConsultation = typeConsultation;
    }

    public Consultation typeConsultation(TypeConsultation typeConsultation) {
        this.setTypeConsultation(typeConsultation);
        return this;
    }

    public Set<Examen> getExamen() {
        return this.examen;
    }

    public void setExamen(Set<Examen> examen) {
        if (this.examen != null) {
            this.examen.forEach(i -> i.setConsultation(null));
        }
        if (examen != null) {
            examen.forEach(i -> i.setConsultation(this));
        }
        this.examen = examen;
    }

    public Consultation examen(Set<Examen> examen) {
        this.setExamen(examen);
        return this;
    }

    public Consultation addExamen(Examen examen) {
        this.examen.add(examen);
        examen.setConsultation(this);
        return this;
    }

    public Consultation removeExamen(Examen examen) {
        this.examen.remove(examen);
        examen.setConsultation(null);
        return this;
    }

    public Set<MiseEnObservation> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<MiseEnObservation> miseEnObservations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setMiseEnObservation(null));
        }
        if (miseEnObservations != null) {
            miseEnObservations.forEach(i -> i.setMiseEnObservation(this));
        }
        this.consultations = miseEnObservations;
    }

    public Consultation consultations(Set<MiseEnObservation> miseEnObservations) {
        this.setConsultations(miseEnObservations);
        return this;
    }

    public Consultation addConsultation(MiseEnObservation miseEnObservation) {
        this.consultations.add(miseEnObservation);
        miseEnObservation.setMiseEnObservation(this);
        return this;
    }

    public Consultation removeConsultation(MiseEnObservation miseEnObservation) {
        this.consultations.remove(miseEnObservation);
        miseEnObservation.setMiseEnObservation(null);
        return this;
    }

    public Set<Pathologie> getPathologies() {
        return this.pathologies;
    }

    public void setPathologies(Set<Pathologie> pathologies) {
        if (this.pathologies != null) {
            this.pathologies.forEach(i -> i.removeConsultation(this));
        }
        if (pathologies != null) {
            pathologies.forEach(i -> i.addConsultation(this));
        }
        this.pathologies = pathologies;
    }

    public Consultation pathologies(Set<Pathologie> pathologies) {
        this.setPathologies(pathologies);
        return this;
    }

    public Consultation addPathologie(Pathologie pathologie) {
        this.pathologies.add(pathologie);
        pathologie.getConsultations().add(this);
        return this;
    }

    public Consultation removePathologie(Pathologie pathologie) {
        this.pathologies.remove(pathologie);
        pathologie.getConsultations().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consultation)) {
            return false;
        }
        return id != null && id.equals(((Consultation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consultation{" +
            "id=" + getId() +
            ", dateConsultation='" + getDateConsultation() + "'" +
            ", motif='" + getMotif() + "'" +
            ", diagnostic='" + getDiagnostic() + "'" +
            ", consultationObservation='" + getConsultationObservation() + "'" +
            "}";
    }
}
