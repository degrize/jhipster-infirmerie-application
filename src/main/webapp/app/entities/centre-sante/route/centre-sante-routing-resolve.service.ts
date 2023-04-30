import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICentreSante } from '../centre-sante.model';
import { CentreSanteService } from '../service/centre-sante.service';

@Injectable({ providedIn: 'root' })
export class CentreSanteRoutingResolveService implements Resolve<ICentreSante | null> {
  constructor(protected service: CentreSanteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICentreSante | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((centreSante: HttpResponse<ICentreSante>) => {
          if (centreSante.body) {
            return of(centreSante.body);
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
