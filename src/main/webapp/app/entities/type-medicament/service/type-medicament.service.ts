import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeMedicament, NewTypeMedicament } from '../type-medicament.model';

export type PartialUpdateTypeMedicament = Partial<ITypeMedicament> & Pick<ITypeMedicament, 'id'>;

export type EntityResponseType = HttpResponse<ITypeMedicament>;
export type EntityArrayResponseType = HttpResponse<ITypeMedicament[]>;

@Injectable({ providedIn: 'root' })
export class TypeMedicamentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-medicaments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeMedicament: NewTypeMedicament): Observable<EntityResponseType> {
    return this.http.post<ITypeMedicament>(this.resourceUrl, typeMedicament, { observe: 'response' });
  }

  update(typeMedicament: ITypeMedicament): Observable<EntityResponseType> {
    return this.http.put<ITypeMedicament>(`${this.resourceUrl}/${this.getTypeMedicamentIdentifier(typeMedicament)}`, typeMedicament, {
      observe: 'response',
    });
  }

  partialUpdate(typeMedicament: PartialUpdateTypeMedicament): Observable<EntityResponseType> {
    return this.http.patch<ITypeMedicament>(`${this.resourceUrl}/${this.getTypeMedicamentIdentifier(typeMedicament)}`, typeMedicament, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeMedicament>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeMedicament[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTypeMedicamentIdentifier(typeMedicament: Pick<ITypeMedicament, 'id'>): number {
    return typeMedicament.id;
  }

  compareTypeMedicament(o1: Pick<ITypeMedicament, 'id'> | null, o2: Pick<ITypeMedicament, 'id'> | null): boolean {
    return o1 && o2 ? this.getTypeMedicamentIdentifier(o1) === this.getTypeMedicamentIdentifier(o2) : o1 === o2;
  }

  addTypeMedicamentToCollectionIfMissing<Type extends Pick<ITypeMedicament, 'id'>>(
    typeMedicamentCollection: Type[],
    ...typeMedicamentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const typeMedicaments: Type[] = typeMedicamentsToCheck.filter(isPresent);
    if (typeMedicaments.length > 0) {
      const typeMedicamentCollectionIdentifiers = typeMedicamentCollection.map(
        typeMedicamentItem => this.getTypeMedicamentIdentifier(typeMedicamentItem)!
      );
      const typeMedicamentsToAdd = typeMedicaments.filter(typeMedicamentItem => {
        const typeMedicamentIdentifier = this.getTypeMedicamentIdentifier(typeMedicamentItem);
        if (typeMedicamentCollectionIdentifiers.includes(typeMedicamentIdentifier)) {
          return false;
        }
        typeMedicamentCollectionIdentifiers.push(typeMedicamentIdentifier);
        return true;
      });
      return [...typeMedicamentsToAdd, ...typeMedicamentCollection];
    }
    return typeMedicamentCollection;
  }
}
