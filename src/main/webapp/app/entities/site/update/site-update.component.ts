import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SiteFormService, SiteFormGroup } from './site-form.service';
import { ISite } from '../site.model';
import { SiteService } from '../service/site.service';

@Component({
  selector: 'jhi-site-update',
  templateUrl: './site-update.component.html',
})
export class SiteUpdateComponent implements OnInit {
  isSaving = false;
  site: ISite | null = null;

  editForm: SiteFormGroup = this.siteFormService.createSiteFormGroup();

  constructor(protected siteService: SiteService, protected siteFormService: SiteFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ site }) => {
      this.site = site;
      if (site) {
        this.updateForm(site);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const site = this.siteFormService.getSite(this.editForm);
    if (site.id !== null) {
      this.subscribeToSaveResponse(this.siteService.update(site));
    } else {
      this.subscribeToSaveResponse(this.siteService.create(site));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISite>>): void {
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

  protected updateForm(site: ISite): void {
    this.site = site;
    this.siteFormService.resetForm(this.editForm, site);
  }
}
