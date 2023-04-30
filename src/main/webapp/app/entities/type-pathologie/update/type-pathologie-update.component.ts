import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TypePathologieFormService, TypePathologieFormGroup } from './type-pathologie-form.service';
import { ITypePathologie } from '../type-pathologie.model';
import { TypePathologieService } from '../service/type-pathologie.service';

@Component({
  selector: 'jhi-type-pathologie-update',
  templateUrl: './type-pathologie-update.component.html',
})
export class TypePathologieUpdateComponent implements OnInit {
  isSaving = false;
  typePathologie: ITypePathologie | null = null;

  editForm: TypePathologieFormGroup = this.typePathologieFormService.createTypePathologieFormGroup();

  constructor(
    protected typePathologieService: TypePathologieService,
    protected typePathologieFormService: TypePathologieFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typePathologie }) => {
      this.typePathologie = typePathologie;
      if (typePathologie) {
        this.updateForm(typePathologie);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typePathologie = this.typePathologieFormService.getTypePathologie(this.editForm);
    if (typePathologie.id !== null) {
      this.subscribeToSaveResponse(this.typePathologieService.update(typePathologie));
    } else {
      this.subscribeToSaveResponse(this.typePathologieService.create(typePathologie));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypePathologie>>): void {
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

  protected updateForm(typePathologie: ITypePathologie): void {
    this.typePathologie = typePathologie;
    this.typePathologieFormService.resetForm(this.editForm, typePathologie);
  }
}
