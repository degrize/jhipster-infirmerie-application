import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeConsultation } from '../type-consultation.model';

@Component({
  selector: 'jhi-type-consultation-detail',
  templateUrl: './type-consultation-detail.component.html',
})
export class TypeConsultationDetailComponent implements OnInit {
  typeConsultation: ITypeConsultation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeConsultation }) => {
      this.typeConsultation = typeConsultation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
