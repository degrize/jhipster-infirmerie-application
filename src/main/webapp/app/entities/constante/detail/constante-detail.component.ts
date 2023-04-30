import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConstante } from '../constante.model';

@Component({
  selector: 'jhi-constante-detail',
  templateUrl: './constante-detail.component.html',
})
export class ConstanteDetailComponent implements OnInit {
  constante: IConstante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ constante }) => {
      this.constante = constante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
