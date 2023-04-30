package com.ingstic2.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Patient.
 */
@Entity
@Table(name = "patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "pre_nom")
    private String preNom;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "lieu_naissance")
    private String lieuNaissance;

    @Column(name = "sexe")
    private String sexe;

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photo_content_type")
    private String photoContentType;

    @Column(name = "contact")
    private String contact;

    @Column(name = "statut")
    private String statut;

    @Column(name = "tabac")
    private String tabac;

    @Column(name = "alcool")
    private String alcool;

    @Column(name = "sport")
    private String sport;

    @Column(name = "cigarette")
    private String cigarette;

    @Column(name = "contact_parent")
    private String contactParent;

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient" }, allowSetters = true)
    private Set<Antecedent> antecedents = new HashSet<>();

    @JsonIgnoreProperties(value = { "patient", "chambre", "classe" }, allowSetters = true)
    @OneToOne(mappedBy = "patient")
    private Etudiant etudiant;

    @JsonIgnoreProperties(value = { "patient", "service" }, allowSetters = true)
    @OneToOne(mappedBy = "patient")
    private Personnel personnel;

    @OneToMany(mappedBy = "patient")
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

    public Patient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Patient nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPreNom() {
        return this.preNom;
    }

    public Patient preNom(String preNom) {
        this.setPreNom(preNom);
        return this;
    }

    public void setPreNom(String preNom) {
        this.preNom = preNom;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public Patient dateNaissance(LocalDate dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return this.lieuNaissance;
    }

    public Patient lieuNaissance(String lieuNaissance) {
        this.setLieuNaissance(lieuNaissance);
        return this;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getSexe() {
        return this.sexe;
    }

    public Patient sexe(String sexe) {
        this.setSexe(sexe);
        return this;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Patient photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Patient photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public String getContact() {
        return this.contact;
    }

    public Patient contact(String contact) {
        this.setContact(contact);
        return this;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getStatut() {
        return this.statut;
    }

    public Patient statut(String statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getTabac() {
        return this.tabac;
    }

    public Patient tabac(String tabac) {
        this.setTabac(tabac);
        return this;
    }

    public void setTabac(String tabac) {
        this.tabac = tabac;
    }

    public String getAlcool() {
        return this.alcool;
    }

    public Patient alcool(String alcool) {
        this.setAlcool(alcool);
        return this;
    }

    public void setAlcool(String alcool) {
        this.alcool = alcool;
    }

    public String getSport() {
        return this.sport;
    }

    public Patient sport(String sport) {
        this.setSport(sport);
        return this;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }

    public String getCigarette() {
        return this.cigarette;
    }

    public Patient cigarette(String cigarette) {
        this.setCigarette(cigarette);
        return this;
    }

    public void setCigarette(String cigarette) {
        this.cigarette = cigarette;
    }

    public String getContactParent() {
        return this.contactParent;
    }

    public Patient contactParent(String contactParent) {
        this.setContactParent(contactParent);
        return this;
    }

    public void setContactParent(String contactParent) {
        this.contactParent = contactParent;
    }

    public Set<Antecedent> getAntecedents() {
        return this.antecedents;
    }

    public void setAntecedents(Set<Antecedent> antecedents) {
        if (this.antecedents != null) {
            this.antecedents.forEach(i -> i.setPatient(null));
        }
        if (antecedents != null) {
            antecedents.forEach(i -> i.setPatient(this));
        }
        this.antecedents = antecedents;
    }

    public Patient antecedents(Set<Antecedent> antecedents) {
        this.setAntecedents(antecedents);
        return this;
    }

    public Patient addAntecedent(Antecedent antecedent) {
        this.antecedents.add(antecedent);
        antecedent.setPatient(this);
        return this;
    }

    public Patient removeAntecedent(Antecedent antecedent) {
        this.antecedents.remove(antecedent);
        antecedent.setPatient(null);
        return this;
    }

    public Etudiant getEtudiant() {
        return this.etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        if (this.etudiant != null) {
            this.etudiant.setPatient(null);
        }
        if (etudiant != null) {
            etudiant.setPatient(this);
        }
        this.etudiant = etudiant;
    }

    public Patient etudiant(Etudiant etudiant) {
        this.setEtudiant(etudiant);
        return this;
    }

    public Personnel getPersonnel() {
        return this.personnel;
    }

    public void setPersonnel(Personnel personnel) {
        if (this.personnel != null) {
            this.personnel.setPatient(null);
        }
        if (personnel != null) {
            personnel.setPatient(this);
        }
        this.personnel = personnel;
    }

    public Patient personnel(Personnel personnel) {
        this.setPersonnel(personnel);
        return this;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<Consultation> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setPatient(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setPatient(this));
        }
        this.consultations = consultations;
    }

    public Patient consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public Patient addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.setPatient(this);
        return this;
    }

    public Patient removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.setPatient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return id != null && id.equals(((Patient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", preNom='" + getPreNom() + "'" +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", lieuNaissance='" + getLieuNaissance() + "'" +
            ", sexe='" + getSexe() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            ", contact='" + getContact() + "'" +
            ", statut='" + getStatut() + "'" +
            ", tabac='" + getTabac() + "'" +
            ", alcool='" + getAlcool() + "'" +
            ", sport='" + getSport() + "'" +
            ", cigarette='" + getCigarette() + "'" +
            ", contactParent='" + getContactParent() + "'" +
            "}";
    }
}
