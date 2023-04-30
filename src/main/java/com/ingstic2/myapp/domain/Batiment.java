package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Batiment.
 */
@Entity
@Table(name = "batiment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Batiment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @ManyToOne
    @JsonIgnoreProperties(value = { "batiments" }, allowSetters = true)
    private Site site;

    @OneToMany(mappedBy = "batiment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "batiment", "etudiant" }, allowSetters = true)
    private Set<Chambre> chambres = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Batiment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Batiment nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Site getSite() {
        return this.site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public Batiment site(Site site) {
        this.setSite(site);
        return this;
    }

    public Set<Chambre> getChambres() {
        return this.chambres;
    }

    public void setChambres(Set<Chambre> chambres) {
        if (this.chambres != null) {
            this.chambres.forEach(i -> i.setBatiment(null));
        }
        if (chambres != null) {
            chambres.forEach(i -> i.setBatiment(this));
        }
        this.chambres = chambres;
    }

    public Batiment chambres(Set<Chambre> chambres) {
        this.setChambres(chambres);
        return this;
    }

    public Batiment addChambre(Chambre chambre) {
        this.chambres.add(chambre);
        chambre.setBatiment(this);
        return this;
    }

    public Batiment removeChambre(Chambre chambre) {
        this.chambres.remove(chambre);
        chambre.setBatiment(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Batiment)) {
            return false;
        }
        return id != null && id.equals(((Batiment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Batiment{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
