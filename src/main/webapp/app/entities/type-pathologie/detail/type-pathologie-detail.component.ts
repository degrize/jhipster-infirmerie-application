import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypePathologie } from '../type-pathologie.model';

@Component({
  selector: 'jhi-type-pathologie-detail',
  templateUrl: './type-pathologie-detail.component.html',
})
export class TypePathologieDetailComponent implements OnInit {
  typePathologie: ITypePathologie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typePathologie }) => {
      this.typePathologie = typePathologie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
