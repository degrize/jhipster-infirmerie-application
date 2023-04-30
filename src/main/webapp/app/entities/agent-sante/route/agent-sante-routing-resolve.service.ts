import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAgentSante } from '../agent-sante.model';
import { AgentSanteService } from '../service/agent-sante.service';

@Injectable({ providedIn: 'root' })
export class AgentSanteRoutingResolveService implements Resolve<IAgentSante | null> {
  constructor(protected service: AgentSanteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAgentSante | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((agentSante: HttpResponse<IAgentSante>) => {
          if (agentSante.body) {
            return of(agentSante.body);
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
