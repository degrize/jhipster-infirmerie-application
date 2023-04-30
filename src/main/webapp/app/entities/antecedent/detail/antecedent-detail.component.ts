import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAntecedent } from '../antecedent.model';

@Component({
  selector: 'jhi-antecedent-detail',
  templateUrl: './antecedent-detail.component.html',
})
export class AntecedentDetailComponent implements OnInit {
  antecedent: IAntecedent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antecedent }) => {
      this.antecedent = antecedent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
