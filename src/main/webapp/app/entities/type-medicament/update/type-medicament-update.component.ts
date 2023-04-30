import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TypeMedicamentFormService, TypeMedicamentFormGroup } from './type-medicament-form.service';
import { ITypeMedicament } from '../type-medicament.model';
import { TypeMedicamentService } from '../service/type-medicament.service';

@Component({
  selector: 'jhi-type-medicament-update',
  templateUrl: './type-medicament-update.component.html',
})
export class TypeMedicamentUpdateComponent implements OnInit {
  isSaving = false;
  typeMedicament: ITypeMedicament | null = null;

  editForm: TypeMedicamentFormGroup = this.typeMedicamentFormService.createTypeMedicamentFormGroup();

  constructor(
    protected typeMedicamentService: TypeMedicamentService,
    protected typeMedicamentFormService: TypeMedicamentFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeMedicament }) => {
      this.typeMedicament = typeMedicament;
      if (typeMedicament) {
        this.updateForm(typeMedicament);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeMedicament = this.typeMedicamentFormService.getTypeMedicament(this.editForm);
    if (typeMedicament.id !== null) {
      this.subscribeToSaveResponse(this.typeMedicamentService.update(typeMedicament));
    } else {
      this.subscribeToSaveResponse(this.typeMedicamentService.create(typeMedicament));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeMedicament>>): void {
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

  protected updateForm(typeMedicament: ITypeMedicament): void {
    this.typeMedicament = typeMedicament;
    this.typeMedicamentFormService.resetForm(this.editForm, typeMedicament);
  }
}
