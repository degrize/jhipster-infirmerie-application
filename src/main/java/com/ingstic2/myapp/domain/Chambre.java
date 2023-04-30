package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Chambre.
 */
@Entity
@Table(name = "chambre")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Chambre implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "numero_chambre")
    private Integer numeroChambre;

    @ManyToOne
    @JsonIgnoreProperties(value = { "site", "chambres" }, allowSetters = true)
    private Batiment batiment;

    @JsonIgnoreProperties(value = { "patient", "chambre", "classe" }, allowSetters = true)
    @OneToOne(mappedBy = "chambre")
    private Etudiant etudiant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chambre id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroChambre() {
        return this.numeroChambre;
    }

    public Chambre numeroChambre(Integer numeroChambre) {
        this.setNumeroChambre(numeroChambre);
        return this;
    }

    public void setNumeroChambre(Integer numeroChambre) {
        this.numeroChambre = numeroChambre;
    }

    public Batiment getBatiment() {
        return this.batiment;
    }

    public void setBatiment(Batiment batiment) {
        this.batiment = batiment;
    }

    public Chambre batiment(Batiment batiment) {
        this.setBatiment(batiment);
        return this;
    }

    public Etudiant getEtudiant() {
        return this.etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        if (this.etudiant != null) {
            this.etudiant.setChambre(null);
        }
        if (etudiant != null) {
            etudiant.setChambre(this);
        }
        this.etudiant = etudiant;
    }

    public Chambre etudiant(Etudiant etudiant) {
        this.setEtudiant(etudiant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chambre)) {
            return false;
        }
        return id != null && id.equals(((Chambre) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chambre{" +
            "id=" + getId() +
            ", numeroChambre=" + getNumeroChambre() +
            "}";
    }
}
