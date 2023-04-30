import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChambre } from '../chambre.model';
import { ChambreService } from '../service/chambre.service';

@Injectable({ providedIn: 'root' })
export class ChambreRoutingResolveService implements Resolve<IChambre | null> {
  constructor(protected service: ChambreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChambre | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chambre: HttpResponse<IChambre>) => {
          if (chambre.body) {
            return of(chambre.body);
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
