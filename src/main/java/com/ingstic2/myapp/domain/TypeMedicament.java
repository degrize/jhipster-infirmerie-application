package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TypeMedicament.
 */
@Entity
@Table(name = "type_medicament")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TypeMedicament implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "type_medicament")
    private String typeMedicament;

    @OneToMany(mappedBy = "typeMedicament")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeMedicament", "ordonnance" }, allowSetters = true)
    private Set<Medicament> medicaments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypeMedicament id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeMedicament() {
        return this.typeMedicament;
    }

    public TypeMedicament typeMedicament(String typeMedicament) {
        this.setTypeMedicament(typeMedicament);
        return this;
    }

    public void setTypeMedicament(String typeMedicament) {
        this.typeMedicament = typeMedicament;
    }

    public Set<Medicament> getMedicaments() {
        return this.medicaments;
    }

    public void setMedicaments(Set<Medicament> medicaments) {
        if (this.medicaments != null) {
            this.medicaments.forEach(i -> i.setTypeMedicament(null));
        }
        if (medicaments != null) {
            medicaments.forEach(i -> i.setTypeMedicament(this));
        }
        this.medicaments = medicaments;
    }

    public TypeMedicament medicaments(Set<Medicament> medicaments) {
        this.setMedicaments(medicaments);
        return this;
    }

    public TypeMedicament addMedicament(Medicament medicament) {
        this.medicaments.add(medicament);
        medicament.setTypeMedicament(this);
        return this;
    }

    public TypeMedicament removeMedicament(Medicament medicament) {
        this.medicaments.remove(medicament);
        medicament.setTypeMedicament(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeMedicament)) {
            return false;
        }
        return id != null && id.equals(((TypeMedicament) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeMedicament{" +
            "id=" + getId() +
            ", typeMedicament='" + getTypeMedicament() + "'" +
            "}";
    }
}
