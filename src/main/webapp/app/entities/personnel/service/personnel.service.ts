import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonnel, NewPersonnel } from '../personnel.model';

export type PartialUpdatePersonnel = Partial<IPersonnel> & Pick<IPersonnel, 'id'>;

export type EntityResponseType = HttpResponse<IPersonnel>;
export type EntityArrayResponseType = HttpResponse<IPersonnel[]>;

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/personnel');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(personnel: NewPersonnel): Observable<EntityResponseType> {
    return this.http.post<IPersonnel>(this.resourceUrl, personnel, { observe: 'response' });
  }

  update(personnel: IPersonnel): Observable<EntityResponseType> {
    return this.http.put<IPersonnel>(`${this.resourceUrl}/${this.getPersonnelIdentifier(personnel)}`, personnel, { observe: 'response' });
  }

  partialUpdate(personnel: PartialUpdatePersonnel): Observable<EntityResponseType> {
    return this.http.patch<IPersonnel>(`${this.resourceUrl}/${this.getPersonnelIdentifier(personnel)}`, personnel, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPersonnel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPersonnel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPersonnelIdentifier(personnel: Pick<IPersonnel, 'id'>): number {
    return personnel.id;
  }

  comparePersonnel(o1: Pick<IPersonnel, 'id'> | null, o2: Pick<IPersonnel, 'id'> | null): boolean {
    return o1 && o2 ? this.getPersonnelIdentifier(o1) === this.getPersonnelIdentifier(o2) : o1 === o2;
  }

  addPersonnelToCollectionIfMissing<Type extends Pick<IPersonnel, 'id'>>(
    personnelCollection: Type[],
    ...personnelToCheck: (Type | null | undefined)[]
  ): Type[] {
    const personnel: Type[] = personnelToCheck.filter(isPresent);
    if (personnel.length > 0) {
      const personnelCollectionIdentifiers = personnelCollection.map(personnelItem => this.getPersonnelIdentifier(personnelItem)!);
      const personnelToAdd = personnel.filter(personnelItem => {
        const personnelIdentifier = this.getPersonnelIdentifier(personnelItem);
        if (personnelCollectionIdentifiers.includes(personnelIdentifier)) {
          return false;
        }
        personnelCollectionIdentifiers.push(personnelIdentifier);
        return true;
      });
      return [...personnelToAdd, ...personnelCollection];
    }
    return personnelCollection;
  }
}
