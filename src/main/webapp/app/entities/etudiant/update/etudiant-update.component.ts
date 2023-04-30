import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EtudiantFormService, EtudiantFormGroup } from './etudiant-form.service';
import { IEtudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IChambre } from 'app/entities/chambre/chambre.model';
import { ChambreService } from 'app/entities/chambre/service/chambre.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';

@Component({
  selector: 'jhi-etudiant-update',
  templateUrl: './etudiant-update.component.html',
})
export class EtudiantUpdateComponent implements OnInit {
  isSaving = false;
  etudiant: IEtudiant | null = null;

  patientsCollection: IPatient[] = [];
  chambresCollection: IChambre[] = [];
  classesSharedCollection: IClasse[] = [];

  editForm: EtudiantFormGroup = this.etudiantFormService.createEtudiantFormGroup();

  constructor(
    protected etudiantService: EtudiantService,
    protected etudiantFormService: EtudiantFormService,
    protected patientService: PatientService,
    protected chambreService: ChambreService,
    protected classeService: ClasseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePatient = (o1: IPatient | null, o2: IPatient | null): boolean => this.patientService.comparePatient(o1, o2);

  compareChambre = (o1: IChambre | null, o2: IChambre | null): boolean => this.chambreService.compareChambre(o1, o2);

  compareClasse = (o1: IClasse | null, o2: IClasse | null): boolean => this.classeService.compareClasse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etudiant }) => {
      this.etudiant = etudiant;
      if (etudiant) {
        this.updateForm(etudiant);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etudiant = this.etudiantFormService.getEtudiant(this.editForm);
    if (etudiant.id !== null) {
      this.subscribeToSaveResponse(this.etudiantService.update(etudiant));
    } else {
      this.subscribeToSaveResponse(this.etudiantService.create(etudiant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtudiant>>): void {
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

  protected updateForm(etudiant: IEtudiant): void {
    this.etudiant = etudiant;
    this.etudiantFormService.resetForm(this.editForm, etudiant);

    this.patientsCollection = this.patientService.addPatientToCollectionIfMissing<IPatient>(this.patientsCollection, etudiant.patient);
    this.chambresCollection = this.chambreService.addChambreToCollectionIfMissing<IChambre>(this.chambresCollection, etudiant.chambre);
    this.classesSharedCollection = this.classeService.addClasseToCollectionIfMissing<IClasse>(
      this.classesSharedCollection,
      etudiant.classe
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientService
      .query({ filter: 'etudiant-is-null' })
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing<IPatient>(patients, this.etudiant?.patient)))
      .subscribe((patients: IPatient[]) => (this.patientsCollection = patients));

    this.chambreService
      .query({ filter: 'etudiant-is-null' })
      .pipe(map((res: HttpResponse<IChambre[]>) => res.body ?? []))
      .pipe(map((chambres: IChambre[]) => this.chambreService.addChambreToCollectionIfMissing<IChambre>(chambres, this.etudiant?.chambre)))
      .subscribe((chambres: IChambre[]) => (this.chambresCollection = chambres));

    this.classeService
      .query()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classes: IClasse[]) => this.classeService.addClasseToCollectionIfMissing<IClasse>(classes, this.etudiant?.classe)))
      .subscribe((classes: IClasse[]) => (this.classesSharedCollection = classes));
  }
}
