import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ConsultationFormService, ConsultationFormGroup } from './consultation-form.service';
import { IConsultation } from '../consultation.model';
import { ConsultationService } from '../service/consultation.service';
import { IConstante } from 'app/entities/constante/constante.model';
import { ConstanteService } from 'app/entities/constante/service/constante.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IAgentSante } from 'app/entities/agent-sante/agent-sante.model';
import { AgentSanteService } from 'app/entities/agent-sante/service/agent-sante.service';
import { IOrdonnance } from 'app/entities/ordonnance/ordonnance.model';
import { OrdonnanceService } from 'app/entities/ordonnance/service/ordonnance.service';
import { ITypeConsultation } from 'app/entities/type-consultation/type-consultation.model';
import { TypeConsultationService } from 'app/entities/type-consultation/service/type-consultation.service';

@Component({
  selector: 'jhi-consultation-update',
  templateUrl: './consultation-update.component.html',
})
export class ConsultationUpdateComponent implements OnInit {
  isSaving = false;
  consultation: IConsultation | null = null;

  constantesCollection: IConstante[] = [];
  patientsSharedCollection: IPatient[] = [];
  agentSantesSharedCollection: IAgentSante[] = [];
  ordonnancesSharedCollection: IOrdonnance[] = [];
  typeConsultationsSharedCollection: ITypeConsultation[] = [];

  editForm: ConsultationFormGroup = this.consultationFormService.createConsultationFormGroup();

  constructor(
    protected consultationService: ConsultationService,
    protected consultationFormService: ConsultationFormService,
    protected constanteService: ConstanteService,
    protected patientService: PatientService,
    protected agentSanteService: AgentSanteService,
    protected ordonnanceService: OrdonnanceService,
    protected typeConsultationService: TypeConsultationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareConstante = (o1: IConstante | null, o2: IConstante | null): boolean => this.constanteService.compareConstante(o1, o2);

  comparePatient = (o1: IPatient | null, o2: IPatient | null): boolean => this.patientService.comparePatient(o1, o2);

  compareAgentSante = (o1: IAgentSante | null, o2: IAgentSante | null): boolean => this.agentSanteService.compareAgentSante(o1, o2);

  compareOrdonnance = (o1: IOrdonnance | null, o2: IOrdonnance | null): boolean => this.ordonnanceService.compareOrdonnance(o1, o2);

  compareTypeConsultation = (o1: ITypeConsultation | null, o2: ITypeConsultation | null): boolean =>
    this.typeConsultationService.compareTypeConsultation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultation }) => {
      this.consultation = consultation;
      if (consultation) {
        this.updateForm(consultation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consultation = this.consultationFormService.getConsultation(this.editForm);
    if (consultation.id !== null) {
      this.subscribeToSaveResponse(this.consultationService.update(consultation));
    } else {
      this.subscribeToSaveResponse(this.consultationService.create(consultation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsultation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(consultation: IConsultation): void {
    this.consultation = consultation;
    this.consultationFormService.resetForm(this.editForm, consultation);

    this.constantesCollection = this.constanteService.addConstanteToCollectionIfMissing<IConstante>(
      this.constantesCollection,
      consultation.constante
    );
    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing<IPatient>(
      this.patientsSharedCollection,
      consultation.patient
    );
    this.agentSantesSharedCollection = this.agentSanteService.addAgentSanteToCollectionIfMissing<IAgentSante>(
      this.agentSantesSharedCollection,
      consultation.agentSante
    );
    this.ordonnancesSharedCollection = this.ordonnanceService.addOrdonnanceToCollectionIfMissing<IOrdonnance>(
      this.ordonnancesSharedCollection,
      consultation.ordonnance
    );
    this.typeConsultationsSharedCollection = this.typeConsultationService.addTypeConsultationToCollectionIfMissing<ITypeConsultation>(
      this.typeConsultationsSharedCollection,
      consultation.typeConsultation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.constanteService
      .query({ filter: 'consultation-is-null' })
      .pipe(map((res: HttpResponse<IConstante[]>) => res.body ?? []))
      .pipe(
        map((constantes: IConstante[]) =>
          this.constanteService.addConstanteToCollectionIfMissing<IConstante>(constantes, this.consultation?.constante)
        )
      )
      .subscribe((constantes: IConstante[]) => (this.constantesCollection = constantes));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing<IPatient>(patients, this.consultation?.patient))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));

    this.agentSanteService
      .query()
      .pipe(map((res: HttpResponse<IAgentSante[]>) => res.body ?? []))
      .pipe(
        map((agentSantes: IAgentSante[]) =>
          this.agentSanteService.addAgentSanteToCollectionIfMissing<IAgentSante>(agentSantes, this.consultation?.agentSante)
        )
      )
      .subscribe((agentSantes: IAgentSante[]) => (this.agentSantesSharedCollection = agentSantes));

    this.ordonnanceService
      .query()
      .pipe(map((res: HttpResponse<IOrdonnance[]>) => res.body ?? []))
      .pipe(
        map((ordonnances: IOrdonnance[]) =>
          this.ordonnanceService.addOrdonnanceToCollectionIfMissing<IOrdonnance>(ordonnances, this.consultation?.ordonnance)
        )
      )
      .subscribe((ordonnances: IOrdonnance[]) => (this.ordonnancesSharedCollection = ordonnances));

    this.typeConsultationService
      .query()
      .pipe(map((res: HttpResponse<ITypeConsultation[]>) => res.body ?? []))
      .pipe(
        map((typeConsultations: ITypeConsultation[]) =>
          this.typeConsultationService.addTypeConsultationToCollectionIfMissing<ITypeConsultation>(
            typeConsultations,
            this.consultation?.typeConsultation
          )
        )
      )
      .subscribe((typeConsultations: ITypeConsultation[]) => (this.typeConsultationsSharedCollection = typeConsultations));
  }
}
