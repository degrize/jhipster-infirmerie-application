import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMiseEnObservation } from '../mise-en-observation.model';
import { MiseEnObservationService } from '../service/mise-en-observation.service';

@Injectable({ providedIn: 'root' })
export class MiseEnObservationRoutingResolveService implements Resolve<IMiseEnObservation | null> {
  constructor(protected service: MiseEnObservationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMiseEnObservation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((miseEnObservation: HttpResponse<IMiseEnObservation>) => {
          if (miseEnObservation.body) {
            return of(miseEnObservation.body);
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
