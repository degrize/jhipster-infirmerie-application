import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MiseEnObservationFormService, MiseEnObservationFormGroup } from './mise-en-observation-form.service';
import { IMiseEnObservation } from '../mise-en-observation.model';
import { MiseEnObservationService } from '../service/mise-en-observation.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

@Component({
  selector: 'jhi-mise-en-observation-update',
  templateUrl: './mise-en-observation-update.component.html',
})
export class MiseEnObservationUpdateComponent implements OnInit {
  isSaving = false;
  miseEnObservation: IMiseEnObservation | null = null;

  consultationsSharedCollection: IConsultation[] = [];

  editForm: MiseEnObservationFormGroup = this.miseEnObservationFormService.createMiseEnObservationFormGroup();

  constructor(
    protected miseEnObservationService: MiseEnObservationService,
    protected miseEnObservationFormService: MiseEnObservationFormService,
    protected consultationService: ConsultationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareConsultation = (o1: IConsultation | null, o2: IConsultation | null): boolean =>
    this.consultationService.compareConsultation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ miseEnObservation }) => {
      this.miseEnObservation = miseEnObservation;
      if (miseEnObservation) {
        this.updateForm(miseEnObservation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const miseEnObservation = this.miseEnObservationFormService.getMiseEnObservation(this.editForm);
    if (miseEnObservation.id !== null) {
      this.subscribeToSaveResponse(this.miseEnObservationService.update(miseEnObservation));
    } else {
      this.subscribeToSaveResponse(this.miseEnObservationService.create(miseEnObservation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMiseEnObservation>>): void {
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

  protected updateForm(miseEnObservation: IMiseEnObservation): void {
    this.miseEnObservation = miseEnObservation;
    this.miseEnObservationFormService.resetForm(this.editForm, miseEnObservation);

    this.consultationsSharedCollection = this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(
      this.consultationsSharedCollection,
      miseEnObservation.miseEnObservation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.consultationService
      .query()
      .pipe(map((res: HttpResponse<IConsultation[]>) => res.body ?? []))
      .pipe(
        map((consultations: IConsultation[]) =>
          this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(
            consultations,
            this.miseEnObservation?.miseEnObservation
          )
        )
      )
      .subscribe((consultations: IConsultation[]) => (this.consultationsSharedCollection = consultations));
  }
}
