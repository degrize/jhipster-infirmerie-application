package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Medicament.
 */
@Entity
@Table(name = "medicament")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Medicament implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "medicament")
    private String medicament;

    @ManyToOne
    @JsonIgnoreProperties(value = { "medicaments" }, allowSetters = true)
    private TypeMedicament typeMedicament;

    @ManyToOne
    @JsonIgnoreProperties(value = { "consultations", "medicaments" }, allowSetters = true)
    private Ordonnance ordonnance;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Medicament id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedicament() {
        return this.medicament;
    }

    public Medicament medicament(String medicament) {
        this.setMedicament(medicament);
        return this;
    }

    public void setMedicament(String medicament) {
        this.medicament = medicament;
    }

    public TypeMedicament getTypeMedicament() {
        return this.typeMedicament;
    }

    public void setTypeMedicament(TypeMedicament typeMedicament) {
        this.typeMedicament = typeMedicament;
    }

    public Medicament typeMedicament(TypeMedicament typeMedicament) {
        this.setTypeMedicament(typeMedicament);
        return this;
    }

    public Ordonnance getOrdonnance() {
        return this.ordonnance;
    }

    public void setOrdonnance(Ordonnance ordonnance) {
        this.ordonnance = ordonnance;
    }

    public Medicament ordonnance(Ordonnance ordonnance) {
        this.setOrdonnance(ordonnance);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Medicament)) {
            return false;
        }
        return id != null && id.equals(((Medicament) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Medicament{" +
            "id=" + getId() +
            ", medicament='" + getMedicament() + "'" +
            "}";
    }
}
