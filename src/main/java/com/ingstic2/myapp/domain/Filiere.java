package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ingstic2.myapp.domain.enumeration.Cycle;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Filiere.
 */
@Entity
@Table(name = "filiere")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Filiere implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(name = "cycle")
    private Cycle cycle;

    @ManyToOne
    @JsonIgnoreProperties(value = { "etudiants", "filieres" }, allowSetters = true)
    private Classe classe;

    @ManyToOne
    @JsonIgnoreProperties(value = { "filieres" }, allowSetters = true)
    private Ecole ecole;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Filiere id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Filiere nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Cycle getCycle() {
        return this.cycle;
    }

    public Filiere cycle(Cycle cycle) {
        this.setCycle(cycle);
        return this;
    }

    public void setCycle(Cycle cycle) {
        this.cycle = cycle;
    }

    public Classe getClasse() {
        return this.classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Filiere classe(Classe classe) {
        this.setClasse(classe);
        return this;
    }

    public Ecole getEcole() {
        return this.ecole;
    }

    public void setEcole(Ecole ecole) {
        this.ecole = ecole;
    }

    public Filiere ecole(Ecole ecole) {
        this.setEcole(ecole);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Filiere)) {
            return false;
        }
        return id != null && id.equals(((Filiere) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Filiere{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", cycle='" + getCycle() + "'" +
            "}";
    }
}
