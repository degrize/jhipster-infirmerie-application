import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPathologie } from '../pathologie.model';
import { PathologieService } from '../service/pathologie.service';

@Injectable({ providedIn: 'root' })
export class PathologieRoutingResolveService implements Resolve<IPathologie | null> {
  constructor(protected service: PathologieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPathologie | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pathologie: HttpResponse<IPathologie>) => {
          if (pathologie.body) {
            return of(pathologie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
