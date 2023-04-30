import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MedicamentFormService, MedicamentFormGroup } from './medicament-form.service';
import { IMedicament } from '../medicament.model';
import { MedicamentService } from '../service/medicament.service';
import { ITypeMedicament } from 'app/entities/type-medicament/type-medicament.model';
import { TypeMedicamentService } from 'app/entities/type-medicament/service/type-medicament.service';
import { IOrdonnance } from 'app/entities/ordonnance/ordonnance.model';
import { OrdonnanceService } from 'app/entities/ordonnance/service/ordonnance.service';

@Component({
  selector: 'jhi-medicament-update',
  templateUrl: './medicament-update.component.html',
})
export class MedicamentUpdateComponent implements OnInit {
  isSaving = false;
  medicament: IMedicament | null = null;

  typeMedicamentsSharedCollection: ITypeMedicament[] = [];
  ordonnancesSharedCollection: IOrdonnance[] = [];

  editForm: MedicamentFormGroup = this.medicamentFormService.createMedicamentFormGroup();

  constructor(
    protected medicamentService: MedicamentService,
    protected medicamentFormService: MedicamentFormService,
    protected typeMedicamentService: TypeMedicamentService,
    protected ordonnanceService: OrdonnanceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTypeMedicament = (o1: ITypeMedicament | null, o2: ITypeMedicament | null): boolean =>
    this.typeMedicamentService.compareTypeMedicament(o1, o2);

  compareOrdonnance = (o1: IOrdonnance | null, o2: IOrdonnance | null): boolean => this.ordonnanceService.compareOrdonnance(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicament }) => {
      this.medicament = medicament;
      if (medicament) {
        this.updateForm(medicament);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medicament = this.medicamentFormService.getMedicament(this.editForm);
    if (medicament.id !== null) {
      this.subscribeToSaveResponse(this.medicamentService.update(medicament));
    } else {
      this.subscribeToSaveResponse(this.medicamentService.create(medicament));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedicament>>): void {
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

  protected updateForm(medicament: IMedicament): void {
    this.medicament = medicament;
    this.medicamentFormService.resetForm(this.editForm, medicament);

    this.typeMedicamentsSharedCollection = this.typeMedicamentService.addTypeMedicamentToCollectionIfMissing<ITypeMedicament>(
      this.typeMedicamentsSharedCollection,
      medicament.typeMedicament
    );
    this.ordonnancesSharedCollection = this.ordonnanceService.addOrdonnanceToCollectionIfMissing<IOrdonnance>(
      this.ordonnancesSharedCollection,
      medicament.ordonnance
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typeMedicamentService
      .query()
      .pipe(map((res: HttpResponse<ITypeMedicament[]>) => res.body ?? []))
      .pipe(
        map((typeMedicaments: ITypeMedicament[]) =>
          this.typeMedicamentService.addTypeMedicamentToCollectionIfMissing<ITypeMedicament>(
            typeMedicaments,
            this.medicament?.typeMedicament
          )
        )
      )
      .subscribe((typeMedicaments: ITypeMedicament[]) => (this.typeMedicamentsSharedCollection = typeMedicaments));

    this.ordonnanceService
      .query()
      .pipe(map((res: HttpResponse<IOrdonnance[]>) => res.body ?? []))
      .pipe(
        map((ordonnances: IOrdonnance[]) =>
          this.ordonnanceService.addOrdonnanceToCollectionIfMissing<IOrdonnance>(ordonnances, this.medicament?.ordonnance)
        )
      )
      .subscribe((ordonnances: IOrdonnance[]) => (this.ordonnancesSharedCollection = ordonnances));
  }
}
