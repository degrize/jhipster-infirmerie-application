import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AgentSanteFormService, AgentSanteFormGroup } from './agent-sante-form.service';
import { IAgentSante } from '../agent-sante.model';
import { AgentSanteService } from '../service/agent-sante.service';
import { ISpecialite } from 'app/entities/specialite/specialite.model';
import { SpecialiteService } from 'app/entities/specialite/service/specialite.service';

@Component({
  selector: 'jhi-agent-sante-update',
  templateUrl: './agent-sante-update.component.html',
})
export class AgentSanteUpdateComponent implements OnInit {
  isSaving = false;
  agentSante: IAgentSante | null = null;

  specialitesSharedCollection: ISpecialite[] = [];

  editForm: AgentSanteFormGroup = this.agentSanteFormService.createAgentSanteFormGroup();

  constructor(
    protected agentSanteService: AgentSanteService,
    protected agentSanteFormService: AgentSanteFormService,
    protected specialiteService: SpecialiteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSpecialite = (o1: ISpecialite | null, o2: ISpecialite | null): boolean => this.specialiteService.compareSpecialite(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agentSante }) => {
      this.agentSante = agentSante;
      if (agentSante) {
        this.updateForm(agentSante);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agentSante = this.agentSanteFormService.getAgentSante(this.editForm);
    if (agentSante.id !== null) {
      this.subscribeToSaveResponse(this.agentSanteService.update(agentSante));
    } else {
      this.subscribeToSaveResponse(this.agentSanteService.create(agentSante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgentSante>>): void {
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

  protected updateForm(agentSante: IAgentSante): void {
    this.agentSante = agentSante;
    this.agentSanteFormService.resetForm(this.editForm, agentSante);

    this.specialitesSharedCollection = this.specialiteService.addSpecialiteToCollectionIfMissing<ISpecialite>(
      this.specialitesSharedCollection,
      ...(agentSante.specialites ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.specialiteService
      .query()
      .pipe(map((res: HttpResponse<ISpecialite[]>) => res.body ?? []))
      .pipe(
        map((specialites: ISpecialite[]) =>
          this.specialiteService.addSpecialiteToCollectionIfMissing<ISpecialite>(specialites, ...(this.agentSante?.specialites ?? []))
        )
      )
      .subscribe((specialites: ISpecialite[]) => (this.specialitesSharedCollection = specialites));
  }
}
