import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChambre, NewChambre } from '../chambre.model';

export type PartialUpdateChambre = Partial<IChambre> & Pick<IChambre, 'id'>;

export type EntityResponseType = HttpResponse<IChambre>;
export type EntityArrayResponseType = HttpResponse<IChambre[]>;

@Injectable({ providedIn: 'root' })
export class ChambreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chambres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chambre: NewChambre): Observable<EntityResponseType> {
    return this.http.post<IChambre>(this.resourceUrl, chambre, { observe: 'response' });
  }

  update(chambre: IChambre): Observable<EntityResponseType> {
    return this.http.put<IChambre>(`${this.resourceUrl}/${this.getChambreIdentifier(chambre)}`, chambre, { observe: 'response' });
  }

  partialUpdate(chambre: PartialUpdateChambre): Observable<EntityResponseType> {
    return this.http.patch<IChambre>(`${this.resourceUrl}/${this.getChambreIdentifier(chambre)}`, chambre, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChambre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChambre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChambreIdentifier(chambre: Pick<IChambre, 'id'>): number {
    return chambre.id;
  }

  compareChambre(o1: Pick<IChambre, 'id'> | null, o2: Pick<IChambre, 'id'> | null): boolean {
    return o1 && o2 ? this.getChambreIdentifier(o1) === this.getChambreIdentifier(o2) : o1 === o2;
  }

  addChambreToCollectionIfMissing<Type extends Pick<IChambre, 'id'>>(
    chambreCollection: Type[],
    ...chambresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const chambres: Type[] = chambresToCheck.filter(isPresent);
    if (chambres.length > 0) {
      const chambreCollectionIdentifiers = chambreCollection.map(chambreItem => this.getChambreIdentifier(chambreItem)!);
      const chambresToAdd = chambres.filter(chambreItem => {
        const chambreIdentifier = this.getChambreIdentifier(chambreItem);
        if (chambreCollectionIdentifiers.includes(chambreIdentifier)) {
          return false;
        }
        chambreCollectionIdentifiers.push(chambreIdentifier);
        return true;
      });
      return [...chambresToAdd, ...chambreCollection];
    }
    return chambreCollection;
  }
}
