import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TypeConsultationFormService, TypeConsultationFormGroup } from './type-consultation-form.service';
import { ITypeConsultation } from '../type-consultation.model';
import { TypeConsultationService } from '../service/type-consultation.service';

@Component({
  selector: 'jhi-type-consultation-update',
  templateUrl: './type-consultation-update.component.html',
})
export class TypeConsultationUpdateComponent implements OnInit {
  isSaving = false;
  typeConsultation: ITypeConsultation | null = null;

  editForm: TypeConsultationFormGroup = this.typeConsultationFormService.createTypeConsultationFormGroup();

  constructor(
    protected typeConsultationService: TypeConsultationService,
    protected typeConsultationFormService: TypeConsultationFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeConsultation }) => {
      this.typeConsultation = typeConsultation;
      if (typeConsultation) {
        this.updateForm(typeConsultation);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeConsultation = this.typeConsultationFormService.getTypeConsultation(this.editForm);
    if (typeConsultation.id !== null) {
      this.subscribeToSaveResponse(this.typeConsultationService.update(typeConsultation));
    } else {
      this.subscribeToSaveResponse(this.typeConsultationService.create(typeConsultation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeConsultation>>): void {
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

  protected updateForm(typeConsultation: ITypeConsultation): void {
    this.typeConsultation = typeConsultation;
    this.typeConsultationFormService.resetForm(this.editForm, typeConsultation);
  }
}
