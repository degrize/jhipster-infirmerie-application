import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SpecialiteFormService, SpecialiteFormGroup } from './specialite-form.service';
import { ISpecialite } from '../specialite.model';
import { SpecialiteService } from '../service/specialite.service';

@Component({
  selector: 'jhi-specialite-update',
  templateUrl: './specialite-update.component.html',
})
export class SpecialiteUpdateComponent implements OnInit {
  isSaving = false;
  specialite: ISpecialite | null = null;

  editForm: SpecialiteFormGroup = this.specialiteFormService.createSpecialiteFormGroup();

  constructor(
    protected specialiteService: SpecialiteService,
    protected specialiteFormService: SpecialiteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ specialite }) => {
      this.specialite = specialite;
      if (specialite) {
        this.updateForm(specialite);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const specialite = this.specialiteFormService.getSpecialite(this.editForm);
    if (specialite.id !== null) {
      this.subscribeToSaveResponse(this.specialiteService.update(specialite));
    } else {
      this.subscribeToSaveResponse(this.specialiteService.create(specialite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpecialite>>): void {
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

  protected updateForm(specialite: ISpecialite): void {
    this.specialite = specialite;
    this.specialiteFormService.resetForm(this.editForm, specialite);
  }
}
