import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ConstanteFormService, ConstanteFormGroup } from './constante-form.service';
import { IConstante } from '../constante.model';
import { ConstanteService } from '../service/constante.service';

@Component({
  selector: 'jhi-constante-update',
  templateUrl: './constante-update.component.html',
})
export class ConstanteUpdateComponent implements OnInit {
  isSaving = false;
  constante: IConstante | null = null;

  editForm: ConstanteFormGroup = this.constanteFormService.createConstanteFormGroup();

  constructor(
    protected constanteService: ConstanteService,
    protected constanteFormService: ConstanteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ constante }) => {
      this.constante = constante;
      if (constante) {
        this.updateForm(constante);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const constante = this.constanteFormService.getConstante(this.editForm);
    if (constante.id !== null) {
      this.subscribeToSaveResponse(this.constanteService.update(constante));
    } else {
      this.subscribeToSaveResponse(this.constanteService.create(constante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConstante>>): void {
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

  protected updateForm(constante: IConstante): void {
    this.constante = constante;
    this.constanteFormService.resetForm(this.editForm, constante);
  }
}
