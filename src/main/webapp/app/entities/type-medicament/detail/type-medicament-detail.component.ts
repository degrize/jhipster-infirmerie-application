import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeMedicament } from '../type-medicament.model';

@Component({
  selector: 'jhi-type-medicament-detail',
  templateUrl: './type-medicament-detail.component.html',
})
export class TypeMedicamentDetailComponent implements OnInit {
  typeMedicament: ITypeMedicament | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeMedicament }) => {
      this.typeMedicament = typeMedicament;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
