import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypePathologie } from '../type-pathologie.model';
import { TypePathologieService } from '../service/type-pathologie.service';

@Injectable({ providedIn: 'root' })
export class TypePathologieRoutingResolveService implements Resolve<ITypePathologie | null> {
  constructor(protected service: TypePathologieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypePathologie | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typePathologie: HttpResponse<ITypePathologie>) => {
          if (typePathologie.body) {
            return of(typePathologie.body);
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
