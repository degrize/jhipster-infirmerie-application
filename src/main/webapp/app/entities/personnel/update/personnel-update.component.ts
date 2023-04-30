import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PersonnelFormService, PersonnelFormGroup } from './personnel-form.service';
import { IPersonnel } from '../personnel.model';
import { PersonnelService } from '../service/personnel.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

@Component({
  selector: 'jhi-personnel-update',
  templateUrl: './personnel-update.component.html',
})
export class PersonnelUpdateComponent implements OnInit {
  isSaving = false;
  personnel: IPersonnel | null = null;

  patientsCollection: IPatient[] = [];
  servicesSharedCollection: IService[] = [];

  editForm: PersonnelFormGroup = this.personnelFormService.createPersonnelFormGroup();

  constructor(
    protected personnelService: PersonnelService,
    protected personnelFormService: PersonnelFormService,
    protected patientService: PatientService,
    protected serviceService: ServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePatient = (o1: IPatient | null, o2: IPatient | null): boolean => this.patientService.comparePatient(o1, o2);

  compareService = (o1: IService | null, o2: IService | null): boolean => this.serviceService.compareService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personnel }) => {
      this.personnel = personnel;
      if (personnel) {
        this.updateForm(personnel);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const personnel = this.personnelFormService.getPersonnel(this.editForm);
    if (personnel.id !== null) {
      this.subscribeToSaveResponse(this.personnelService.update(personnel));
    } else {
      this.subscribeToSaveResponse(this.personnelService.create(personnel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonnel>>): void {
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

  protected updateForm(personnel: IPersonnel): void {
    this.personnel = personnel;
    this.personnelFormService.resetForm(this.editForm, personnel);

    this.patientsCollection = this.patientService.addPatientToCollectionIfMissing<IPatient>(this.patientsCollection, personnel.patient);
    this.servicesSharedCollection = this.serviceService.addServiceToCollectionIfMissing<IService>(
      this.servicesSharedCollection,
      personnel.service
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientService
      .query({ filter: 'personnel-is-null' })
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing<IPatient>(patients, this.personnel?.patient)))
      .subscribe((patients: IPatient[]) => (this.patientsCollection = patients));

    this.serviceService
      .query()
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(map((services: IService[]) => this.serviceService.addServiceToCollectionIfMissing<IService>(services, this.personnel?.service)))
      .subscribe((services: IService[]) => (this.servicesSharedCollection = services));
  }
}
