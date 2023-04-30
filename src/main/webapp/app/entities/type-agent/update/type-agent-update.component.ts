import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TypeAgentFormService, TypeAgentFormGroup } from './type-agent-form.service';
import { ITypeAgent } from '../type-agent.model';
import { TypeAgentService } from '../service/type-agent.service';
import { IAgentSante } from 'app/entities/agent-sante/agent-sante.model';
import { AgentSanteService } from 'app/entities/agent-sante/service/agent-sante.service';

@Component({
  selector: 'jhi-type-agent-update',
  templateUrl: './type-agent-update.component.html',
})
export class TypeAgentUpdateComponent implements OnInit {
  isSaving = false;
  typeAgent: ITypeAgent | null = null;

  agentSantesSharedCollection: IAgentSante[] = [];

  editForm: TypeAgentFormGroup = this.typeAgentFormService.createTypeAgentFormGroup();

  constructor(
    protected typeAgentService: TypeAgentService,
    protected typeAgentFormService: TypeAgentFormService,
    protected agentSanteService: AgentSanteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAgentSante = (o1: IAgentSante | null, o2: IAgentSante | null): boolean => this.agentSanteService.compareAgentSante(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeAgent }) => {
      this.typeAgent = typeAgent;
      if (typeAgent) {
        this.updateForm(typeAgent);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeAgent = this.typeAgentFormService.getTypeAgent(this.editForm);
    if (typeAgent.id !== null) {
      this.subscribeToSaveResponse(this.typeAgentService.update(typeAgent));
    } else {
      this.subscribeToSaveResponse(this.typeAgentService.create(typeAgent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeAgent>>): void {
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

  protected updateForm(typeAgent: ITypeAgent): void {
    this.typeAgent = typeAgent;
    this.typeAgentFormService.resetForm(this.editForm, typeAgent);

    this.agentSantesSharedCollection = this.agentSanteService.addAgentSanteToCollectionIfMissing<IAgentSante>(
      this.agentSantesSharedCollection,
      typeAgent.agentSante
    );
  }

  protected loadRelationshipsOptions(): void {
    this.agentSanteService
      .query()
      .pipe(map((res: HttpResponse<IAgentSante[]>) => res.body ?? []))
      .pipe(
        map((agentSantes: IAgentSante[]) =>
          this.agentSanteService.addAgentSanteToCollectionIfMissing<IAgentSante>(agentSantes, this.typeAgent?.agentSante)
        )
      )
      .subscribe((agentSantes: IAgentSante[]) => (this.agentSantesSharedCollection = agentSantes));
  }
}
