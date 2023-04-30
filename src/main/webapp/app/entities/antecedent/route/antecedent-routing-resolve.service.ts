import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAntecedent } from '../antecedent.model';
import { AntecedentService } from '../service/antecedent.service';

@Injectable({ providedIn: 'root' })
export class AntecedentRoutingResolveService implements Resolve<IAntecedent | null> {
  constructor(protected service: AntecedentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAntecedent | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((antecedent: HttpResponse<IAntecedent>) => {
          if (antecedent.body) {
            return of(antecedent.body);
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
