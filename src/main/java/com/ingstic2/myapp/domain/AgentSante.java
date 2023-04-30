package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AgentSante.
 */
@Entity
@Table(name = "agent_sante")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AgentSante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "contact")
    private String contact;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "login")
    private String login;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    @OneToMany(mappedBy = "agentSante")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "agentSante" }, allowSetters = true)
    private Set<TypeAgent> typeAgents = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_agent_sante__specialite",
        joinColumns = @JoinColumn(name = "agent_sante_id"),
        inverseJoinColumns = @JoinColumn(name = "specialite_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "agentSantes" }, allowSetters = true)
    private Set<Specialite> specialites = new HashSet<>();

    @OneToMany(mappedBy = "agentSante")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "constante", "patient", "agentSante", "rdv", "ordonnance", "typeConsultation", "examen", "consultations", "pathologies" },
        allowSetters = true
    )
    private Set<Consultation> consultations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AgentSante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public AgentSante nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public AgentSante prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getContact() {
        return this.contact;
    }

    public AgentSante contact(String contact) {
        this.setContact(contact);
        return this;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public AgentSante adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getLogin() {
        return this.login;
    }

    public AgentSante login(String login) {
        this.setLogin(login);
        return this;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getMotDePasse() {
        return this.motDePasse;
    }

    public AgentSante motDePasse(String motDePasse) {
        this.setMotDePasse(motDePasse);
        return this;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public Set<TypeAgent> getTypeAgents() {
        return this.typeAgents;
    }

    public void setTypeAgents(Set<TypeAgent> typeAgents) {
        if (this.typeAgents != null) {
            this.typeAgents.forEach(i -> i.setAgentSante(null));
        }
        if (typeAgents != null) {
            typeAgents.forEach(i -> i.setAgentSante(this));
        }
        this.typeAgents = typeAgents;
    }

    public AgentSante typeAgents(Set<TypeAgent> typeAgents) {
        this.setTypeAgents(typeAgents);
        return this;
    }

    public AgentSante addTypeAgent(TypeAgent typeAgent) {
        this.typeAgents.add(typeAgent);
        typeAgent.setAgentSante(this);
        return this;
    }

    public AgentSante removeTypeAgent(TypeAgent typeAgent) {
        this.typeAgents.remove(typeAgent);
        typeAgent.setAgentSante(null);
        return this;
    }

    public Set<Specialite> getSpecialites() {
        return this.specialites;
    }

    public void setSpecialites(Set<Specialite> specialites) {
        this.specialites = specialites;
    }

    public AgentSante specialites(Set<Specialite> specialites) {
        this.setSpecialites(specialites);
        return this;
    }

    public AgentSante addSpecialite(Specialite specialite) {
        this.specialites.add(specialite);
        specialite.getAgentSantes().add(this);
        return this;
    }

    public AgentSante removeSpecialite(Specialite specialite) {
        this.specialites.remove(specialite);
        specialite.getAgentSantes().remove(this);
        return this;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<Consultation> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setAgentSante(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setAgentSante(this));
        }
        this.consultations = consultations;
    }

    public AgentSante consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public AgentSante addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.setAgentSante(this);
        return this;
    }

    public AgentSante removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.setAgentSante(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AgentSante)) {
            return false;
        }
        return id != null && id.equals(((AgentSante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AgentSante{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", contact='" + getContact() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", login='" + getLogin() + "'" +
            ", motDePasse='" + getMotDePasse() + "'" +
            "}";
    }
}
