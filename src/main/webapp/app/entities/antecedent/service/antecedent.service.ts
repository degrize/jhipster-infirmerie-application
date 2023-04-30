import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAntecedent, NewAntecedent } from '../antecedent.model';

export type PartialUpdateAntecedent = Partial<IAntecedent> & Pick<IAntecedent, 'id'>;

export type EntityResponseType = HttpResponse<IAntecedent>;
export type EntityArrayResponseType = HttpResponse<IAntecedent[]>;

@Injectable({ providedIn: 'root' })
export class AntecedentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/antecedents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(antecedent: NewAntecedent): Observable<EntityResponseType> {
    return this.http.post<IAntecedent>(this.resourceUrl, antecedent, { observe: 'response' });
  }

  update(antecedent: IAntecedent): Observable<EntityResponseType> {
    return this.http.put<IAntecedent>(`${this.resourceUrl}/${this.getAntecedentIdentifier(antecedent)}`, antecedent, {
      observe: 'response',
    });
  }

  partialUpdate(antecedent: PartialUpdateAntecedent): Observable<EntityResponseType> {
    return this.http.patch<IAntecedent>(`${this.resourceUrl}/${this.getAntecedentIdentifier(antecedent)}`, antecedent, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAntecedent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAntecedent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAntecedentIdentifier(antecedent: Pick<IAntecedent, 'id'>): number {
    return antecedent.id;
  }

  compareAntecedent(o1: Pick<IAntecedent, 'id'> | null, o2: Pick<IAntecedent, 'id'> | null): boolean {
    return o1 && o2 ? this.getAntecedentIdentifier(o1) === this.getAntecedentIdentifier(o2) : o1 === o2;
  }

  addAntecedentToCollectionIfMissing<Type extends Pick<IAntecedent, 'id'>>(
    antecedentCollection: Type[],
    ...antecedentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const antecedents: Type[] = antecedentsToCheck.filter(isPresent);
    if (antecedents.length > 0) {
      const antecedentCollectionIdentifiers = antecedentCollection.map(antecedentItem => this.getAntecedentIdentifier(antecedentItem)!);
      const antecedentsToAdd = antecedents.filter(antecedentItem => {
        const antecedentIdentifier = this.getAntecedentIdentifier(antecedentItem);
        if (antecedentCollectionIdentifiers.includes(antecedentIdentifier)) {
          return false;
        }
        antecedentCollectionIdentifiers.push(antecedentIdentifier);
        return true;
      });
      return [...antecedentsToAdd, ...antecedentCollection];
    }
    return antecedentCollection;
  }
}
