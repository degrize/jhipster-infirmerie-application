import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConsultation } from '../consultation.model';
import { ConsultationService } from '../service/consultation.service';

@Injectable({ providedIn: 'root' })
export class ConsultationRoutingResolveService implements Resolve<IConsultation | null> {
  constructor(protected service: ConsultationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConsultation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((consultation: HttpResponse<IConsultation>) => {
          if (consultation.body) {
            return of(consultation.body);
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
