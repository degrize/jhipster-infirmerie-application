import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBatiment, NewBatiment } from '../batiment.model';

export type PartialUpdateBatiment = Partial<IBatiment> & Pick<IBatiment, 'id'>;

export type EntityResponseType = HttpResponse<IBatiment>;
export type EntityArrayResponseType = HttpResponse<IBatiment[]>;

@Injectable({ providedIn: 'root' })
export class BatimentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/batiments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(batiment: NewBatiment): Observable<EntityResponseType> {
    return this.http.post<IBatiment>(this.resourceUrl, batiment, { observe: 'response' });
  }

  update(batiment: IBatiment): Observable<EntityResponseType> {
    return this.http.put<IBatiment>(`${this.resourceUrl}/${this.getBatimentIdentifier(batiment)}`, batiment, { observe: 'response' });
  }

  partialUpdate(batiment: PartialUpdateBatiment): Observable<EntityResponseType> {
    return this.http.patch<IBatiment>(`${this.resourceUrl}/${this.getBatimentIdentifier(batiment)}`, batiment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBatiment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBatiment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBatimentIdentifier(batiment: Pick<IBatiment, 'id'>): number {
    return batiment.id;
  }

  compareBatiment(o1: Pick<IBatiment, 'id'> | null, o2: Pick<IBatiment, 'id'> | null): boolean {
    return o1 && o2 ? this.getBatimentIdentifier(o1) === this.getBatimentIdentifier(o2) : o1 === o2;
  }

  addBatimentToCollectionIfMissing<Type extends Pick<IBatiment, 'id'>>(
    batimentCollection: Type[],
    ...batimentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const batiments: Type[] = batimentsToCheck.filter(isPresent);
    if (batiments.length > 0) {
      const batimentCollectionIdentifiers = batimentCollection.map(batimentItem => this.getBatimentIdentifier(batimentItem)!);
      const batimentsToAdd = batiments.filter(batimentItem => {
        const batimentIdentifier = this.getBatimentIdentifier(batimentItem);
        if (batimentCollectionIdentifiers.includes(batimentIdentifier)) {
          return false;
        }
        batimentCollectionIdentifiers.push(batimentIdentifier);
        return true;
      });
      return [...batimentsToAdd, ...batimentCollection];
    }
    return batimentCollection;
  }
}
