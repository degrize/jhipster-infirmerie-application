import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPersonnel } from '../personnel.model';
import { PersonnelService } from '../service/personnel.service';

@Injectable({ providedIn: 'root' })
export class PersonnelRoutingResolveService implements Resolve<IPersonnel | null> {
  constructor(protected service: PersonnelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPersonnel | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((personnel: HttpResponse<IPersonnel>) => {
          if (personnel.body) {
            return of(personnel.body);
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
