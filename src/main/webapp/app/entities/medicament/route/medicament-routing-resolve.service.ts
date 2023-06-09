import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedicament } from '../medicament.model';
import { MedicamentService } from '../service/medicament.service';

@Injectable({ providedIn: 'root' })
export class MedicamentRoutingResolveService implements Resolve<IMedicament | null> {
  constructor(protected service: MedicamentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedicament | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((medicament: HttpResponse<IMedicament>) => {
          if (medicament.body) {
            return of(medicament.body);
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
