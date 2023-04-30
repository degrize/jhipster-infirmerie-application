import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBatiment } from '../batiment.model';
import { BatimentService } from '../service/batiment.service';

@Injectable({ providedIn: 'root' })
export class BatimentRoutingResolveService implements Resolve<IBatiment | null> {
  constructor(protected service: BatimentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBatiment | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((batiment: HttpResponse<IBatiment>) => {
          if (batiment.body) {
            return of(batiment.body);
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
