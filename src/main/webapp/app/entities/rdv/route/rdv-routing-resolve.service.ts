import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRdv } from '../rdv.model';
import { RdvService } from '../service/rdv.service';

@Injectable({ providedIn: 'root' })
export class RdvRoutingResolveService implements Resolve<IRdv | null> {
  constructor(protected service: RdvService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRdv | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rdv: HttpResponse<IRdv>) => {
          if (rdv.body) {
            return of(rdv.body);
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
