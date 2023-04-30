import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrdonnance } from '../ordonnance.model';

@Component({
  selector: 'jhi-ordonnance-detail',
  templateUrl: './ordonnance-detail.component.html',
})
export class OrdonnanceDetailComponent implements OnInit {
  ordonnance: IOrdonnance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordonnance }) => {
      this.ordonnance = ordonnance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
