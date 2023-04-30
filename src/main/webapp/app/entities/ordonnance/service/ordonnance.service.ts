import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrdonnance, NewOrdonnance } from '../ordonnance.model';

export type PartialUpdateOrdonnance = Partial<IOrdonnance> & Pick<IOrdonnance, 'id'>;

export type EntityResponseType = HttpResponse<IOrdonnance>;
export type EntityArrayResponseType = HttpResponse<IOrdonnance[]>;

@Injectable({ providedIn: 'root' })
export class OrdonnanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ordonnances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ordonnance: NewOrdonnance): Observable<EntityResponseType> {
    return this.http.post<IOrdonnance>(this.resourceUrl, ordonnance, { observe: 'response' });
  }

  update(ordonnance: IOrdonnance): Observable<EntityResponseType> {
    return this.http.put<IOrdonnance>(`${this.resourceUrl}/${this.getOrdonnanceIdentifier(ordonnance)}`, ordonnance, {
      observe: 'response',
    });
  }

  partialUpdate(ordonnance: PartialUpdateOrdonnance): Observable<EntityResponseType> {
    return this.http.patch<IOrdonnance>(`${this.resourceUrl}/${this.getOrdonnanceIdentifier(ordonnance)}`, ordonnance, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrdonnance>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrdonnance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrdonnanceIdentifier(ordonnance: Pick<IOrdonnance, 'id'>): number {
    return ordonnance.id;
  }

  compareOrdonnance(o1: Pick<IOrdonnance, 'id'> | null, o2: Pick<IOrdonnance, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrdonnanceIdentifier(o1) === this.getOrdonnanceIdentifier(o2) : o1 === o2;
  }

  addOrdonnanceToCollectionIfMissing<Type extends Pick<IOrdonnance, 'id'>>(
    ordonnanceCollection: Type[],
    ...ordonnancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ordonnances: Type[] = ordonnancesToCheck.filter(isPresent);
    if (ordonnances.length > 0) {
      const ordonnanceCollectionIdentifiers = ordonnanceCollection.map(ordonnanceItem => this.getOrdonnanceIdentifier(ordonnanceItem)!);
      const ordonnancesToAdd = ordonnances.filter(ordonnanceItem => {
        const ordonnanceIdentifier = this.getOrdonnanceIdentifier(ordonnanceItem);
        if (ordonnanceCollectionIdentifiers.includes(ordonnanceIdentifier)) {
          return false;
        }
        ordonnanceCollectionIdentifiers.push(ordonnanceIdentifier);
        return true;
      });
      return [...ordonnancesToAdd, ...ordonnanceCollection];
    }
    return ordonnanceCollection;
  }
}
