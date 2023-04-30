package com.ingstic2.myapp.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.ingstic2.myapp.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.ingstic2.myapp.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.ingstic2.myapp.domain.User.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Authority.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.User.class.getName() + ".authorities");
            createCache(cm, com.ingstic2.myapp.domain.Consultation.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Consultation.class.getName() + ".examen");
            createCache(cm, com.ingstic2.myapp.domain.Consultation.class.getName() + ".consultations");
            createCache(cm, com.ingstic2.myapp.domain.Consultation.class.getName() + ".pathologies");
            createCache(cm, com.ingstic2.myapp.domain.TypeConsultation.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.TypeConsultation.class.getName() + ".consultations");
            createCache(cm, com.ingstic2.myapp.domain.Patient.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Patient.class.getName() + ".antecedents");
            createCache(cm, com.ingstic2.myapp.domain.Patient.class.getName() + ".consultations");
            createCache(cm, com.ingstic2.myapp.domain.Etudiant.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Service.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Service.class.getName() + ".personnel");
            createCache(cm, com.ingstic2.myapp.domain.Personnel.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Site.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Site.class.getName() + ".batiments");
            createCache(cm, com.ingstic2.myapp.domain.Batiment.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Batiment.class.getName() + ".chambres");
            createCache(cm, com.ingstic2.myapp.domain.Chambre.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Antecedent.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Pathologie.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Pathologie.class.getName() + ".consultations");
            createCache(cm, com.ingstic2.myapp.domain.TypePathologie.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.TypePathologie.class.getName() + ".pathologies");
            createCache(cm, com.ingstic2.myapp.domain.Rdv.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.AgentSante.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.AgentSante.class.getName() + ".typeAgents");
            createCache(cm, com.ingstic2.myapp.domain.AgentSante.class.getName() + ".specialites");
            createCache(cm, com.ingstic2.myapp.domain.AgentSante.class.getName() + ".consultations");
            createCache(cm, com.ingstic2.myapp.domain.Ordonnance.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Ordonnance.class.getName() + ".consultations");
            createCache(cm, com.ingstic2.myapp.domain.Ordonnance.class.getName() + ".medicaments");
            createCache(cm, com.ingstic2.myapp.domain.Medicament.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.TypeMedicament.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.TypeMedicament.class.getName() + ".medicaments");
            createCache(cm, com.ingstic2.myapp.domain.Constante.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Examen.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.MiseEnObservation.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.CentreSante.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Specialite.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Specialite.class.getName() + ".agentSantes");
            createCache(cm, com.ingstic2.myapp.domain.TypeAgent.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Classe.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Classe.class.getName() + ".etudiants");
            createCache(cm, com.ingstic2.myapp.domain.Classe.class.getName() + ".filieres");
            createCache(cm, com.ingstic2.myapp.domain.Filiere.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Ecole.class.getName());
            createCache(cm, com.ingstic2.myapp.domain.Ecole.class.getName() + ".filieres");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
