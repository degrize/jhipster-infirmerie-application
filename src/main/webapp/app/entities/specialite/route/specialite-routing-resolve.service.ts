import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISpecialite } from '../specialite.model';
import { SpecialiteService } from '../service/specialite.service';

@Injectable({ providedIn: 'root' })
export class SpecialiteRoutingResolveService implements Resolve<ISpecialite | null> {
  constructor(protected service: SpecialiteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISpecialite | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((specialite: HttpResponse<ISpecialite>) => {
          if (specialite.body) {
            return of(specialite.body);
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
