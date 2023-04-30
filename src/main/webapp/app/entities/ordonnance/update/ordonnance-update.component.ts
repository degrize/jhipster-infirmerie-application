import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { OrdonnanceFormService, OrdonnanceFormGroup } from './ordonnance-form.service';
import { IOrdonnance } from '../ordonnance.model';
import { OrdonnanceService } from '../service/ordonnance.service';

@Component({
  selector: 'jhi-ordonnance-update',
  templateUrl: './ordonnance-update.component.html',
})
export class OrdonnanceUpdateComponent implements OnInit {
  isSaving = false;
  ordonnance: IOrdonnance | null = null;

  editForm: OrdonnanceFormGroup = this.ordonnanceFormService.createOrdonnanceFormGroup();

  constructor(
    protected ordonnanceService: OrdonnanceService,
    protected ordonnanceFormService: OrdonnanceFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordonnance }) => {
      this.ordonnance = ordonnance;
      if (ordonnance) {
        this.updateForm(ordonnance);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ordonnance = this.ordonnanceFormService.getOrdonnance(this.editForm);
    if (ordonnance.id !== null) {
      this.subscribeToSaveResponse(this.ordonnanceService.update(ordonnance));
    } else {
      this.subscribeToSaveResponse(this.ordonnanceService.create(ordonnance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrdonnance>>): void {
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

  protected updateForm(ordonnance: IOrdonnance): void {
    this.ordonnance = ordonnance;
    this.ordonnanceFormService.resetForm(this.editForm, ordonnance);
  }
}
