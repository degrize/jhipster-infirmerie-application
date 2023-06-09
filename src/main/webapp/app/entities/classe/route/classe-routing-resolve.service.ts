import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClasse } from '../classe.model';
import { ClasseService } from '../service/classe.service';

@Injectable({ providedIn: 'root' })
export class ClasseRoutingResolveService implements Resolve<IClasse | null> {
  constructor(protected service: ClasseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClasse | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((classe: HttpResponse<IClasse>) => {
          if (classe.body) {
            return of(classe.body);
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
