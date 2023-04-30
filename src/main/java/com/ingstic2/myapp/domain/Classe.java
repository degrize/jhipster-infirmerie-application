package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Classe.
 */
@Entity
@Table(name = "classe")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Classe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @OneToMany(mappedBy = "classe")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "chambre", "classe" }, allowSetters = true)
    private Set<Etudiant> etudiants = new HashSet<>();

    @OneToMany(mappedBy = "classe")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "classe", "ecole" }, allowSetters = true)
    private Set<Filiere> filieres = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Classe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Classe nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Etudiant> getEtudiants() {
        return this.etudiants;
    }

    public void setEtudiants(Set<Etudiant> etudiants) {
        if (this.etudiants != null) {
            this.etudiants.forEach(i -> i.setClasse(null));
        }
        if (etudiants != null) {
            etudiants.forEach(i -> i.setClasse(this));
        }
        this.etudiants = etudiants;
    }

    public Classe etudiants(Set<Etudiant> etudiants) {
        this.setEtudiants(etudiants);
        return this;
    }

    public Classe addEtudiant(Etudiant etudiant) {
        this.etudiants.add(etudiant);
        etudiant.setClasse(this);
        return this;
    }

    public Classe removeEtudiant(Etudiant etudiant) {
        this.etudiants.remove(etudiant);
        etudiant.setClasse(null);
        return this;
    }

    public Set<Filiere> getFilieres() {
        return this.filieres;
    }

    public void setFilieres(Set<Filiere> filieres) {
        if (this.filieres != null) {
            this.filieres.forEach(i -> i.setClasse(null));
        }
        if (filieres != null) {
            filieres.forEach(i -> i.setClasse(this));
        }
        this.filieres = filieres;
    }

    public Classe filieres(Set<Filiere> filieres) {
        this.setFilieres(filieres);
        return this;
    }

    public Classe addFiliere(Filiere filiere) {
        this.filieres.add(filiere);
        filiere.setClasse(this);
        return this;
    }

    public Classe removeFiliere(Filiere filiere) {
        this.filieres.remove(filiere);
        filiere.setClasse(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Classe)) {
            return false;
        }
        return id != null && id.equals(((Classe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Classe{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
