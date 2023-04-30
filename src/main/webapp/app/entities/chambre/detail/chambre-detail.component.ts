import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChambre } from '../chambre.model';

@Component({
  selector: 'jhi-chambre-detail',
  templateUrl: './chambre-detail.component.html',
})
export class ChambreDetailComponent implements OnInit {
  chambre: IChambre | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chambre }) => {
      this.chambre = chambre;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
