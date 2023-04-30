import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChambreFormService, ChambreFormGroup } from './chambre-form.service';
import { IChambre } from '../chambre.model';
import { ChambreService } from '../service/chambre.service';
import { IBatiment } from 'app/entities/batiment/batiment.model';
import { BatimentService } from 'app/entities/batiment/service/batiment.service';

@Component({
  selector: 'jhi-chambre-update',
  templateUrl: './chambre-update.component.html',
})
export class ChambreUpdateComponent implements OnInit {
  isSaving = false;
  chambre: IChambre | null = null;

  batimentsSharedCollection: IBatiment[] = [];

  editForm: ChambreFormGroup = this.chambreFormService.createChambreFormGroup();

  constructor(
    protected chambreService: ChambreService,
    protected chambreFormService: ChambreFormService,
    protected batimentService: BatimentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBatiment = (o1: IBatiment | null, o2: IBatiment | null): boolean => this.batimentService.compareBatiment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chambre }) => {
      this.chambre = chambre;
      if (chambre) {
        this.updateForm(chambre);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chambre = this.chambreFormService.getChambre(this.editForm);
    if (chambre.id !== null) {
      this.subscribeToSaveResponse(this.chambreService.update(chambre));
    } else {
      this.subscribeToSaveResponse(this.chambreService.create(chambre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChambre>>): void {
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

  protected updateForm(chambre: IChambre): void {
    this.chambre = chambre;
    this.chambreFormService.resetForm(this.editForm, chambre);

    this.batimentsSharedCollection = this.batimentService.addBatimentToCollectionIfMissing<IBatiment>(
      this.batimentsSharedCollection,
      chambre.batiment
    );
  }

  protected loadRelationshipsOptions(): void {
    this.batimentService
      .query()
      .pipe(map((res: HttpResponse<IBatiment[]>) => res.body ?? []))
      .pipe(
        map((batiments: IBatiment[]) => this.batimentService.addBatimentToCollectionIfMissing<IBatiment>(batiments, this.chambre?.batiment))
      )
      .subscribe((batiments: IBatiment[]) => (this.batimentsSharedCollection = batiments));
  }
}
