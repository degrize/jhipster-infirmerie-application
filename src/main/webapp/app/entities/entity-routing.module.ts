import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'consultation',
        data: { pageTitle: 'infirmerieApp.consultation.home.title' },
        loadChildren: () => import('./consultation/consultation.module').then(m => m.ConsultationModule),
      },
      {
        path: 'type-consultation',
        data: { pageTitle: 'infirmerieApp.typeConsultation.home.title' },
        loadChildren: () => import('./type-consultation/type-consultation.module').then(m => m.TypeConsultationModule),
      },
      {
        path: 'patient',
        data: { pageTitle: 'infirmerieApp.patient.home.title' },
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'etudiant',
        data: { pageTitle: 'infirmerieApp.etudiant.home.title' },
        loadChildren: () => import('./etudiant/etudiant.module').then(m => m.EtudiantModule),
      },
      {
        path: 'service',
        data: { pageTitle: 'infirmerieApp.service.home.title' },
        loadChildren: () => import('./service/service.module').then(m => m.ServiceModule),
      },
      {
        path: 'personnel',
        data: { pageTitle: 'infirmerieApp.personnel.home.title' },
        loadChildren: () => import('./personnel/personnel.module').then(m => m.PersonnelModule),
      },
      {
        path: 'site',
        data: { pageTitle: 'infirmerieApp.site.home.title' },
        loadChildren: () => import('./site/site.module').then(m => m.SiteModule),
      },
      {
        path: 'batiment',
        data: { pageTitle: 'infirmerieApp.batiment.home.title' },
        loadChildren: () => import('./batiment/batiment.module').then(m => m.BatimentModule),
      },
      {
        path: 'chambre',
        data: { pageTitle: 'infirmerieApp.chambre.home.title' },
        loadChildren: () => import('./chambre/chambre.module').then(m => m.ChambreModule),
      },
      {
        path: 'antecedent',
        data: { pageTitle: 'infirmerieApp.antecedent.home.title' },
        loadChildren: () => import('./antecedent/antecedent.module').then(m => m.AntecedentModule),
      },
      {
        path: 'pathologie',
        data: { pageTitle: 'infirmerieApp.pathologie.home.title' },
        loadChildren: () => import('./pathologie/pathologie.module').then(m => m.PathologieModule),
      },
      {
        path: 'type-pathologie',
        data: { pageTitle: 'infirmerieApp.typePathologie.home.title' },
        loadChildren: () => import('./type-pathologie/type-pathologie.module').then(m => m.TypePathologieModule),
      },
      {
        path: 'rdv',
        data: { pageTitle: 'infirmerieApp.rdv.home.title' },
        loadChildren: () => import('./rdv/rdv.module').then(m => m.RdvModule),
      },
      {
        path: 'agent-sante',
        data: { pageTitle: 'infirmerieApp.agentSante.home.title' },
        loadChildren: () => import('./agent-sante/agent-sante.module').then(m => m.AgentSanteModule),
      },
      {
        path: 'ordonnance',
        data: { pageTitle: 'infirmerieApp.ordonnance.home.title' },
        loadChildren: () => import('./ordonnance/ordonnance.module').then(m => m.OrdonnanceModule),
      },
      {
        path: 'medicament',
        data: { pageTitle: 'infirmerieApp.medicament.home.title' },
        loadChildren: () => import('./medicament/medicament.module').then(m => m.MedicamentModule),
      },
      {
        path: 'type-medicament',
        data: { pageTitle: 'infirmerieApp.typeMedicament.home.title' },
        loadChildren: () => import('./type-medicament/type-medicament.module').then(m => m.TypeMedicamentModule),
      },
      {
        path: 'constante',
        data: { pageTitle: 'infirmerieApp.constante.home.title' },
        loadChildren: () => import('./constante/constante.module').then(m => m.ConstanteModule),
      },
      {
        path: 'examen',
        data: { pageTitle: 'infirmerieApp.examen.home.title' },
        loadChildren: () => import('./examen/examen.module').then(m => m.ExamenModule),
      },
      {
        path: 'mise-en-observation',
        data: { pageTitle: 'infirmerieApp.miseEnObservation.home.title' },
        loadChildren: () => import('./mise-en-observation/mise-en-observation.module').then(m => m.MiseEnObservationModule),
      },
      {
        path: 'centre-sante',
        data: { pageTitle: 'infirmerieApp.centreSante.home.title' },
        loadChildren: () => import('./centre-sante/centre-sante.module').then(m => m.CentreSanteModule),
      },
      {
        path: 'specialite',
        data: { pageTitle: 'infirmerieApp.specialite.home.title' },
        loadChildren: () => import('./specialite/specialite.module').then(m => m.SpecialiteModule),
      },
      {
        path: 'type-agent',
        data: { pageTitle: 'infirmerieApp.typeAgent.home.title' },
        loadChildren: () => import('./type-agent/type-agent.module').then(m => m.TypeAgentModule),
      },
      {
        path: 'classe',
        data: { pageTitle: 'infirmerieApp.classe.home.title' },
        loadChildren: () => import('./classe/classe.module').then(m => m.ClasseModule),
      },
      {
        path: 'filiere',
        data: { pageTitle: 'infirmerieApp.filiere.home.title' },
        loadChildren: () => import('./filiere/filiere.module').then(m => m.FiliereModule),
      },
      {
        path: 'ecole',
        data: { pageTitle: 'infirmerieApp.ecole.home.title' },
        loadChildren: () => import('./ecole/ecole.module').then(m => m.EcoleModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
