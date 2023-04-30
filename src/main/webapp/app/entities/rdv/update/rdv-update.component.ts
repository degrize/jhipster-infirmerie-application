import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RdvFormService, RdvFormGroup } from './rdv-form.service';
import { IRdv } from '../rdv.model';
import { RdvService } from '../service/rdv.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

@Component({
  selector: 'jhi-rdv-update',
  templateUrl: './rdv-update.component.html',
})
export class RdvUpdateComponent implements OnInit {
  isSaving = false;
  rdv: IRdv | null = null;

  consultationsCollection: IConsultation[] = [];

  editForm: RdvFormGroup = this.rdvFormService.createRdvFormGroup();

  constructor(
    protected rdvService: RdvService,
    protected rdvFormService: RdvFormService,
    protected consultationService: ConsultationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareConsultation = (o1: IConsultation | null, o2: IConsultation | null): boolean =>
    this.consultationService.compareConsultation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rdv }) => {
      this.rdv = rdv;
      if (rdv) {
        this.updateForm(rdv);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rdv = this.rdvFormService.getRdv(this.editForm);
    if (rdv.id !== null) {
      this.subscribeToSaveResponse(this.rdvService.update(rdv));
    } else {
      this.subscribeToSaveResponse(this.rdvService.create(rdv));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRdv>>): void {
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

  protected updateForm(rdv: IRdv): void {
    this.rdv = rdv;
    this.rdvFormService.resetForm(this.editForm, rdv);

    this.consultationsCollection = this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(
      this.consultationsCollection,
      rdv.consultation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.consultationService
      .query({ filter: 'rdv-is-null' })
      .pipe(map((res: HttpResponse<IConsultation[]>) => res.body ?? []))
      .pipe(
        map((consultations: IConsultation[]) =>
          this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(consultations, this.rdv?.consultation)
        )
      )
      .subscribe((consultations: IConsultation[]) => (this.consultationsCollection = consultations));
  }
}
