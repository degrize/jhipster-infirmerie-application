import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEcole } from '../ecole.model';
import { EcoleService } from '../service/ecole.service';

@Injectable({ providedIn: 'root' })
export class EcoleRoutingResolveService implements Resolve<IEcole | null> {
  constructor(protected service: EcoleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEcole | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ecole: HttpResponse<IEcole>) => {
          if (ecole.body) {
            return of(ecole.body);
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
