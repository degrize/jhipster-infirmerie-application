import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPathologie } from '../pathologie.model';

@Component({
  selector: 'jhi-pathologie-detail',
  templateUrl: './pathologie-detail.component.html',
})
export class PathologieDetailComponent implements OnInit {
  pathologie: IPathologie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pathologie }) => {
      this.pathologie = pathologie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
