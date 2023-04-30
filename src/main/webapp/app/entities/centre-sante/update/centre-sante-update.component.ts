import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CentreSanteFormService, CentreSanteFormGroup } from './centre-sante-form.service';
import { ICentreSante } from '../centre-sante.model';
import { CentreSanteService } from '../service/centre-sante.service';

@Component({
  selector: 'jhi-centre-sante-update',
  templateUrl: './centre-sante-update.component.html',
})
export class CentreSanteUpdateComponent implements OnInit {
  isSaving = false;
  centreSante: ICentreSante | null = null;

  editForm: CentreSanteFormGroup = this.centreSanteFormService.createCentreSanteFormGroup();

  constructor(
    protected centreSanteService: CentreSanteService,
    protected centreSanteFormService: CentreSanteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ centreSante }) => {
      this.centreSante = centreSante;
      if (centreSante) {
        this.updateForm(centreSante);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const centreSante = this.centreSanteFormService.getCentreSante(this.editForm);
    if (centreSante.id !== null) {
      this.subscribeToSaveResponse(this.centreSanteService.update(centreSante));
    } else {
      this.subscribeToSaveResponse(this.centreSanteService.create(centreSante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICentreSante>>): void {
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

  protected updateForm(centreSante: ICentreSante): void {
    this.centreSante = centreSante;
    this.centreSanteFormService.resetForm(this.editForm, centreSante);
  }
}
