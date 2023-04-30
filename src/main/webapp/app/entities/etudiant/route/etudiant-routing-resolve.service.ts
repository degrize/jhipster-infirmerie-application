import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';

@Injectable({ providedIn: 'root' })
export class EtudiantRoutingResolveService implements Resolve<IEtudiant | null> {
  constructor(protected service: EtudiantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEtudiant | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((etudiant: HttpResponse<IEtudiant>) => {
          if (etudiant.body) {
            return of(etudiant.body);
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
