import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRdv } from '../rdv.model';

@Component({
  selector: 'jhi-rdv-detail',
  templateUrl: './rdv-detail.component.html',
})
export class RdvDetailComponent implements OnInit {
  rdv: IRdv | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rdv }) => {
      this.rdv = rdv;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
