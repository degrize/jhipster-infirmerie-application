import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICentreSante } from '../centre-sante.model';

@Component({
  selector: 'jhi-centre-sante-detail',
  templateUrl: './centre-sante-detail.component.html',
})
export class CentreSanteDetailComponent implements OnInit {
  centreSante: ICentreSante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ centreSante }) => {
      this.centreSante = centreSante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
