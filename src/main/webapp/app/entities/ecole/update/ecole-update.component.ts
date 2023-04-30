import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EcoleFormService, EcoleFormGroup } from './ecole-form.service';
import { IEcole } from '../ecole.model';
import { EcoleService } from '../service/ecole.service';

@Component({
  selector: 'jhi-ecole-update',
  templateUrl: './ecole-update.component.html',
})
export class EcoleUpdateComponent implements OnInit {
  isSaving = false;
  ecole: IEcole | null = null;

  editForm: EcoleFormGroup = this.ecoleFormService.createEcoleFormGroup();

  constructor(
    protected ecoleService: EcoleService,
    protected ecoleFormService: EcoleFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ecole }) => {
      this.ecole = ecole;
      if (ecole) {
        this.updateForm(ecole);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ecole = this.ecoleFormService.getEcole(this.editForm);
    if (ecole.id !== null) {
      this.subscribeToSaveResponse(this.ecoleService.update(ecole));
    } else {
      this.subscribeToSaveResponse(this.ecoleService.create(ecole));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEcole>>): void {
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

  protected updateForm(ecole: IEcole): void {
    this.ecole = ecole;
    this.ecoleFormService.resetForm(this.editForm, ecole);
  }
}
