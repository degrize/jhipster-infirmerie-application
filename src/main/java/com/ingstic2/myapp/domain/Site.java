package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Site.
 */
@Entity
@Table(name = "site")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Site implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "site")
    private String site;

    @OneToMany(mappedBy = "site")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "site", "chambres" }, allowSetters = true)
    private Set<Batiment> batiments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Site id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSite() {
        return this.site;
    }

    public Site site(String site) {
        this.setSite(site);
        return this;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public Set<Batiment> getBatiments() {
        return this.batiments;
    }

    public void setBatiments(Set<Batiment> batiments) {
        if (this.batiments != null) {
            this.batiments.forEach(i -> i.setSite(null));
        }
        if (batiments != null) {
            batiments.forEach(i -> i.setSite(this));
        }
        this.batiments = batiments;
    }

    public Site batiments(Set<Batiment> batiments) {
        this.setBatiments(batiments);
        return this;
    }

    public Site addBatiment(Batiment batiment) {
        this.batiments.add(batiment);
        batiment.setSite(this);
        return this;
    }

    public Site removeBatiment(Batiment batiment) {
        this.batiments.remove(batiment);
        batiment.setSite(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Site)) {
            return false;
        }
        return id != null && id.equals(((Site) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Site{" +
            "id=" + getId() +
            ", site='" + getSite() + "'" +
            "}";
    }
}
