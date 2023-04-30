import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEcole } from '../ecole.model';

@Component({
  selector: 'jhi-ecole-detail',
  templateUrl: './ecole-detail.component.html',
})
export class EcoleDetailComponent implements OnInit {
  ecole: IEcole | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ecole }) => {
      this.ecole = ecole;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
