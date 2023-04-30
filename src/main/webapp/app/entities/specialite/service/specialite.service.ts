import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpecialite, NewSpecialite } from '../specialite.model';

export type PartialUpdateSpecialite = Partial<ISpecialite> & Pick<ISpecialite, 'id'>;

export type EntityResponseType = HttpResponse<ISpecialite>;
export type EntityArrayResponseType = HttpResponse<ISpecialite[]>;

@Injectable({ providedIn: 'root' })
export class SpecialiteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/specialites');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(specialite: NewSpecialite): Observable<EntityResponseType> {
    return this.http.post<ISpecialite>(this.resourceUrl, specialite, { observe: 'response' });
  }

  update(specialite: ISpecialite): Observable<EntityResponseType> {
    return this.http.put<ISpecialite>(`${this.resourceUrl}/${this.getSpecialiteIdentifier(specialite)}`, specialite, {
      observe: 'response',
    });
  }

  partialUpdate(specialite: PartialUpdateSpecialite): Observable<EntityResponseType> {
    return this.http.patch<ISpecialite>(`${this.resourceUrl}/${this.getSpecialiteIdentifier(specialite)}`, specialite, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpecialite>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpecialite[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpecialiteIdentifier(specialite: Pick<ISpecialite, 'id'>): number {
    return specialite.id;
  }

  compareSpecialite(o1: Pick<ISpecialite, 'id'> | null, o2: Pick<ISpecialite, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpecialiteIdentifier(o1) === this.getSpecialiteIdentifier(o2) : o1 === o2;
  }

  addSpecialiteToCollectionIfMissing<Type extends Pick<ISpecialite, 'id'>>(
    specialiteCollection: Type[],
    ...specialitesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const specialites: Type[] = specialitesToCheck.filter(isPresent);
    if (specialites.length > 0) {
      const specialiteCollectionIdentifiers = specialiteCollection.map(specialiteItem => this.getSpecialiteIdentifier(specialiteItem)!);
      const specialitesToAdd = specialites.filter(specialiteItem => {
        const specialiteIdentifier = this.getSpecialiteIdentifier(specialiteItem);
        if (specialiteCollectionIdentifiers.includes(specialiteIdentifier)) {
          return false;
        }
        specialiteCollectionIdentifiers.push(specialiteIdentifier);
        return true;
      });
      return [...specialitesToAdd, ...specialiteCollection];
    }
    return specialiteCollection;
  }
}
