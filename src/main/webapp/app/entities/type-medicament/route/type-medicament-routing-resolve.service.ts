import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeMedicament } from '../type-medicament.model';
import { TypeMedicamentService } from '../service/type-medicament.service';

@Injectable({ providedIn: 'root' })
export class TypeMedicamentRoutingResolveService implements Resolve<ITypeMedicament | null> {
  constructor(protected service: TypeMedicamentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeMedicament | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeMedicament: HttpResponse<ITypeMedicament>) => {
          if (typeMedicament.body) {
            return of(typeMedicament.body);
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
