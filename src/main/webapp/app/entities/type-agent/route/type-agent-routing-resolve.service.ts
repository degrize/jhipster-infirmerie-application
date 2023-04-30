import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeAgent } from '../type-agent.model';
import { TypeAgentService } from '../service/type-agent.service';

@Injectable({ providedIn: 'root' })
export class TypeAgentRoutingResolveService implements Resolve<ITypeAgent | null> {
  constructor(protected service: TypeAgentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeAgent | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeAgent: HttpResponse<ITypeAgent>) => {
          if (typeAgent.body) {
            return of(typeAgent.body);
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
