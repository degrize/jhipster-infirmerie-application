import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PathologieFormService, PathologieFormGroup } from './pathologie-form.service';
import { IPathologie } from '../pathologie.model';
import { PathologieService } from '../service/pathologie.service';
import { ITypePathologie } from 'app/entities/type-pathologie/type-pathologie.model';
import { TypePathologieService } from 'app/entities/type-pathologie/service/type-pathologie.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

@Component({
  selector: 'jhi-pathologie-update',
  templateUrl: './pathologie-update.component.html',
})
export class PathologieUpdateComponent implements OnInit {
  isSaving = false;
  pathologie: IPathologie | null = null;

  typePathologiesSharedCollection: ITypePathologie[] = [];
  consultationsSharedCollection: IConsultation[] = [];

  editForm: PathologieFormGroup = this.pathologieFormService.createPathologieFormGroup();

  constructor(
    protected pathologieService: PathologieService,
    protected pathologieFormService: PathologieFormService,
    protected typePathologieService: TypePathologieService,
    protected consultationService: ConsultationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTypePathologie = (o1: ITypePathologie | null, o2: ITypePathologie | null): boolean =>
    this.typePathologieService.compareTypePathologie(o1, o2);

  compareConsultation = (o1: IConsultation | null, o2: IConsultation | null): boolean =>
    this.consultationService.compareConsultation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pathologie }) => {
      this.pathologie = pathologie;
      if (pathologie) {
        this.updateForm(pathologie);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pathologie = this.pathologieFormService.getPathologie(this.editForm);
    if (pathologie.id !== null) {
      this.subscribeToSaveResponse(this.pathologieService.update(pathologie));
    } else {
      this.subscribeToSaveResponse(this.pathologieService.create(pathologie));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPathologie>>): void {
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

  protected updateForm(pathologie: IPathologie): void {
    this.pathologie = pathologie;
    this.pathologieFormService.resetForm(this.editForm, pathologie);

    this.typePathologiesSharedCollection = this.typePathologieService.addTypePathologieToCollectionIfMissing<ITypePathologie>(
      this.typePathologiesSharedCollection,
      pathologie.typePathologie
    );
    this.consultationsSharedCollection = this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(
      this.consultationsSharedCollection,
      ...(pathologie.consultations ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typePathologieService
      .query()
      .pipe(map((res: HttpResponse<ITypePathologie[]>) => res.body ?? []))
      .pipe(
        map((typePathologies: ITypePathologie[]) =>
          this.typePathologieService.addTypePathologieToCollectionIfMissing<ITypePathologie>(
            typePathologies,
            this.pathologie?.typePathologie
          )
        )
      )
      .subscribe((typePathologies: ITypePathologie[]) => (this.typePathologiesSharedCollection = typePathologies));

    this.consultationService
      .query()
      .pipe(map((res: HttpResponse<IConsultation[]>) => res.body ?? []))
      .pipe(
        map((consultations: IConsultation[]) =>
          this.consultationService.addConsultationToCollectionIfMissing<IConsultation>(
            consultations,
            ...(this.pathologie?.consultations ?? [])
          )
        )
      )
      .subscribe((consultations: IConsultation[]) => (this.consultationsSharedCollection = consultations));
  }
}
