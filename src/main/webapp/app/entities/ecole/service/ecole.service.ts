import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEcole, NewEcole } from '../ecole.model';

export type PartialUpdateEcole = Partial<IEcole> & Pick<IEcole, 'id'>;

export type EntityResponseType = HttpResponse<IEcole>;
export type EntityArrayResponseType = HttpResponse<IEcole[]>;

@Injectable({ providedIn: 'root' })
export class EcoleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ecoles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ecole: NewEcole): Observable<EntityResponseType> {
    return this.http.post<IEcole>(this.resourceUrl, ecole, { observe: 'response' });
  }

  update(ecole: IEcole): Observable<EntityResponseType> {
    return this.http.put<IEcole>(`${this.resourceUrl}/${this.getEcoleIdentifier(ecole)}`, ecole, { observe: 'response' });
  }

  partialUpdate(ecole: PartialUpdateEcole): Observable<EntityResponseType> {
    return this.http.patch<IEcole>(`${this.resourceUrl}/${this.getEcoleIdentifier(ecole)}`, ecole, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEcole>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEcole[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEcoleIdentifier(ecole: Pick<IEcole, 'id'>): number {
    return ecole.id;
  }

  compareEcole(o1: Pick<IEcole, 'id'> | null, o2: Pick<IEcole, 'id'> | null): boolean {
    return o1 && o2 ? this.getEcoleIdentifier(o1) === this.getEcoleIdentifier(o2) : o1 === o2;
  }

  addEcoleToCollectionIfMissing<Type extends Pick<IEcole, 'id'>>(
    ecoleCollection: Type[],
    ...ecolesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ecoles: Type[] = ecolesToCheck.filter(isPresent);
    if (ecoles.length > 0) {
      const ecoleCollectionIdentifiers = ecoleCollection.map(ecoleItem => this.getEcoleIdentifier(ecoleItem)!);
      const ecolesToAdd = ecoles.filter(ecoleItem => {
        const ecoleIdentifier = this.getEcoleIdentifier(ecoleItem);
        if (ecoleCollectionIdentifiers.includes(ecoleIdentifier)) {
          return false;
        }
        ecoleCollectionIdentifiers.push(ecoleIdentifier);
        return true;
      });
      return [...ecolesToAdd, ...ecoleCollection];
    }
    return ecoleCollection;
  }
}
