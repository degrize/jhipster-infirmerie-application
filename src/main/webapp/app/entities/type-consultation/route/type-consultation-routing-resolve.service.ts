import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeConsultation } from '../type-consultation.model';
import { TypeConsultationService } from '../service/type-consultation.service';

@Injectable({ providedIn: 'root' })
export class TypeConsultationRoutingResolveService implements Resolve<ITypeConsultation | null> {
  constructor(protected service: TypeConsultationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeConsultation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeConsultation: HttpResponse<ITypeConsultation>) => {
          if (typeConsultation.body) {
            return of(typeConsultation.body);
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
