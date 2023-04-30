package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Etudiant.
 */
@Entity
@Table(name = "etudiant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Etudiant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "matricule")
    private String matricule;

    @JsonIgnoreProperties(value = { "antecedents", "etudiant", "personnel", "consultations" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Patient patient;

    @JsonIgnoreProperties(value = { "batiment", "etudiant" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Chambre chambre;

    @ManyToOne
    @JsonIgnoreProperties(value = { "etudiants", "filieres" }, allowSetters = true)
    private Classe classe;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etudiant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricule() {
        return this.matricule;
    }

    public Etudiant matricule(String matricule) {
        this.setMatricule(matricule);
        return this;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Etudiant patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public Chambre getChambre() {
        return this.chambre;
    }

    public void setChambre(Chambre chambre) {
        this.chambre = chambre;
    }

    public Etudiant chambre(Chambre chambre) {
        this.setChambre(chambre);
        return this;
    }

    public Classe getClasse() {
        return this.classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Etudiant classe(Classe classe) {
        this.setClasse(classe);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etudiant)) {
            return false;
        }
        return id != null && id.equals(((Etudiant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etudiant{" +
            "id=" + getId() +
            ", matricule='" + getMatricule() + "'" +
            "}";
    }
}
