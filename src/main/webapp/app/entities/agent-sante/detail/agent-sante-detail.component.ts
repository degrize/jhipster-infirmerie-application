import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAgentSante } from '../agent-sante.model';

@Component({
  selector: 'jhi-agent-sante-detail',
  templateUrl: './agent-sante-detail.component.html',
})
export class AgentSanteDetailComponent implements OnInit {
  agentSante: IAgentSante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agentSante }) => {
      this.agentSante = agentSante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
