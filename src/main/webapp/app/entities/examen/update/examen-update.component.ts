import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExamenFormService, ExamenFormGroup } from './examen-form.service';
import { IExamen } from '../examen.model';
import { ExamenService } from '../service/examen.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

@Component({
  selector: 'jhi-examen-update',
  templateUrl: './examen-update.component.html',
})
export class ExamenUpdateComponent implements OnInit {
  isSaving = false;
  examen: IExamen | null = null;

  consultationsSharedCollection: IConsultation[] = [];

  editForm: ExamenFormGroup = this.examenFormService.createExamenFormGroup();

  constructor(
    protected examenService: ExamenService,
    protected examenFormService: ExamenFormService,
    protected consultationService: ConsultationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareConsultation = (o1: IConsultation | null, o2: IConsultation | null): boolean =>
    this.consultationService.compareConsultation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examen }) => {
      this.examen = examen;
      if (examen) {
        this.updateForm(examen);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const examen = this.examenFormService.getExamen(this.editForm);
    if (examen.id !== null) {
      this.subscribeToSaveResponse(this.examenService.update(examen));
    } else {
      this.subscribeToSaveResponse(this.examenService.create(examen));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExamen>>): void {
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

  protected updateForm(examen: IExamen): void {
    this.examen = examen;
    this.examenFormService.resetForm(this.editForm, examen);

    this.consultationsSharedCollection = this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(
      this.consultationsSharedCollection,
      examen.consultation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.consultationService
      .query()
      .pipe(map((res: HttpResponse<IConsultation[]>) => res.body ?? []))
      .pipe(
        map((consultations: IConsultation[]) =>
          this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(consultations, this.examen?.consultation)
        )
      )
      .subscribe((consultations: IConsultation[]) => (this.consultationsSharedCollection = consultations));
  }
}
