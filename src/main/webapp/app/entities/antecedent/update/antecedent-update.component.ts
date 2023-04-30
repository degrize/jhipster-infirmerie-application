import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AntecedentFormService, AntecedentFormGroup } from './antecedent-form.service';
import { IAntecedent } from '../antecedent.model';
import { AntecedentService } from '../service/antecedent.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

@Component({
  selector: 'jhi-antecedent-update',
  templateUrl: './antecedent-update.component.html',
})
export class AntecedentUpdateComponent implements OnInit {
  isSaving = false;
  antecedent: IAntecedent | null = null;

  patientsSharedCollection: IPatient[] = [];

  editForm: AntecedentFormGroup = this.antecedentFormService.createAntecedentFormGroup();

  constructor(
    protected antecedentService: AntecedentService,
    protected antecedentFormService: AntecedentFormService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePatient = (o1: IPatient | null, o2: IPatient | null): boolean => this.patientService.comparePatient(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antecedent }) => {
      this.antecedent = antecedent;
      if (antecedent) {
        this.updateForm(antecedent);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const antecedent = this.antecedentFormService.getAntecedent(this.editForm);
    if (antecedent.id !== null) {
      this.subscribeToSaveResponse(this.antecedentService.update(antecedent));
    } else {
      this.subscribeToSaveResponse(this.antecedentService.create(antecedent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAntecedent>>): void {
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

  protected updateForm(antecedent: IAntecedent): void {
    this.antecedent = antecedent;
    this.antecedentFormService.resetForm(this.editForm, antecedent);

    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing<IPatient>(
      this.patientsSharedCollection,
      antecedent.patient
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing<IPatient>(patients, this.antecedent?.patient))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));
  }
}
