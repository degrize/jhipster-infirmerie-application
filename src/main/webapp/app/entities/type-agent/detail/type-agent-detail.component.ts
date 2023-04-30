import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeAgent } from '../type-agent.model';

@Component({
  selector: 'jhi-type-agent-detail',
  templateUrl: './type-agent-detail.component.html',
})
export class TypeAgentDetailComponent implements OnInit {
  typeAgent: ITypeAgent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeAgent }) => {
      this.typeAgent = typeAgent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
