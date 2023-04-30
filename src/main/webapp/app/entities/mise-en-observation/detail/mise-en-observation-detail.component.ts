import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMiseEnObservation } from '../mise-en-observation.model';

@Component({
  selector: 'jhi-mise-en-observation-detail',
  templateUrl: './mise-en-observation-detail.component.html',
})
export class MiseEnObservationDetailComponent implements OnInit {
  miseEnObservation: IMiseEnObservation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ miseEnObservation }) => {
      this.miseEnObservation = miseEnObservation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
