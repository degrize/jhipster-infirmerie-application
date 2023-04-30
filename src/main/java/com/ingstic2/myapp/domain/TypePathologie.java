package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TypePathologie.
 */
@Entity
@Table(name = "type_pathologie")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TypePathologie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "type_pathologie")
    private String typePathologie;

    @OneToMany(mappedBy = "typePathologie")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typePathologie", "consultations" }, allowSetters = true)
    private Set<Pathologie> pathologies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypePathologie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypePathologie() {
        return this.typePathologie;
    }

    public TypePathologie typePathologie(String typePathologie) {
        this.setTypePathologie(typePathologie);
        return this;
    }

    public void setTypePathologie(String typePathologie) {
        this.typePathologie = typePathologie;
    }

    public Set<Pathologie> getPathologies() {
        return this.pathologies;
    }

    public void setPathologies(Set<Pathologie> pathologies) {
        if (this.pathologies != null) {
            this.pathologies.forEach(i -> i.setTypePathologie(null));
        }
        if (pathologies != null) {
            pathologies.forEach(i -> i.setTypePathologie(this));
        }
        this.pathologies = pathologies;
    }

    public TypePathologie pathologies(Set<Pathologie> pathologies) {
        this.setPathologies(pathologies);
        return this;
    }

    public TypePathologie addPathologie(Pathologie pathologie) {
        this.pathologies.add(pathologie);
        pathologie.setTypePathologie(this);
        return this;
    }

    public TypePathologie removePathologie(Pathologie pathologie) {
        this.pathologies.remove(pathologie);
        pathologie.setTypePathologie(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypePathologie)) {
            return false;
        }
        return id != null && id.equals(((TypePathologie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypePathologie{" +
            "id=" + getId() +
            ", typePathologie='" + getTypePathologie() + "'" +
            "}";
    }
}
