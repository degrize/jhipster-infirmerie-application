import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BatimentFormService, BatimentFormGroup } from './batiment-form.service';
import { IBatiment } from '../batiment.model';
import { BatimentService } from '../service/batiment.service';
import { ISite } from 'app/entities/site/site.model';
import { SiteService } from 'app/entities/site/service/site.service';

@Component({
  selector: 'jhi-batiment-update',
  templateUrl: './batiment-update.component.html',
})
export class BatimentUpdateComponent implements OnInit {
  isSaving = false;
  batiment: IBatiment | null = null;

  sitesSharedCollection: ISite[] = [];

  editForm: BatimentFormGroup = this.batimentFormService.createBatimentFormGroup();

  constructor(
    protected batimentService: BatimentService,
    protected batimentFormService: BatimentFormService,
    protected siteService: SiteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSite = (o1: ISite | null, o2: ISite | null): boolean => this.siteService.compareSite(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ batiment }) => {
      this.batiment = batiment;
      if (batiment) {
        this.updateForm(batiment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const batiment = this.batimentFormService.getBatiment(this.editForm);
    if (batiment.id !== null) {
      this.subscribeToSaveResponse(this.batimentService.update(batiment));
    } else {
      this.subscribeToSaveResponse(this.batimentService.create(batiment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBatiment>>): void {
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

  protected updateForm(batiment: IBatiment): void {
    this.batiment = batiment;
    this.batimentFormService.resetForm(this.editForm, batiment);

    this.sitesSharedCollection = this.siteService.addSiteToCollectionIfMissing<ISite>(this.sitesSharedCollection, batiment.site);
  }

  protected loadRelationshipsOptions(): void {
    this.siteService
      .query()
      .pipe(map((res: HttpResponse<ISite[]>) => res.body ?? []))
      .pipe(map((sites: ISite[]) => this.siteService.addSiteToCollectionIfMissing<ISite>(sites, this.batiment?.site)))
      .subscribe((sites: ISite[]) => (this.sitesSharedCollection = sites));
  }
}
