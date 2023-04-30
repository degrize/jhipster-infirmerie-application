import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtudiant, NewEtudiant } from '../etudiant.model';

export type PartialUpdateEtudiant = Partial<IEtudiant> & Pick<IEtudiant, 'id'>;

export type EntityResponseType = HttpResponse<IEtudiant>;
export type EntityArrayResponseType = HttpResponse<IEtudiant[]>;

@Injectable({ providedIn: 'root' })
export class EtudiantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etudiants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(etudiant: NewEtudiant): Observable<EntityResponseType> {
    return this.http.post<IEtudiant>(this.resourceUrl, etudiant, { observe: 'response' });
  }

  update(etudiant: IEtudiant): Observable<EntityResponseType> {
    return this.http.put<IEtudiant>(`${this.resourceUrl}/${this.getEtudiantIdentifier(etudiant)}`, etudiant, { observe: 'response' });
  }

  partialUpdate(etudiant: PartialUpdateEtudiant): Observable<EntityResponseType> {
    return this.http.patch<IEtudiant>(`${this.resourceUrl}/${this.getEtudiantIdentifier(etudiant)}`, etudiant, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtudiant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtudiant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEtudiantIdentifier(etudiant: Pick<IEtudiant, 'id'>): number {
    return etudiant.id;
  }

  compareEtudiant(o1: Pick<IEtudiant, 'id'> | null, o2: Pick<IEtudiant, 'id'> | null): boolean {
    return o1 && o2 ? this.getEtudiantIdentifier(o1) === this.getEtudiantIdentifier(o2) : o1 === o2;
  }

  addEtudiantToCollectionIfMissing<Type extends Pick<IEtudiant, 'id'>>(
    etudiantCollection: Type[],
    ...etudiantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const etudiants: Type[] = etudiantsToCheck.filter(isPresent);
    if (etudiants.length > 0) {
      const etudiantCollectionIdentifiers = etudiantCollection.map(etudiantItem => this.getEtudiantIdentifier(etudiantItem)!);
      const etudiantsToAdd = etudiants.filter(etudiantItem => {
        const etudiantIdentifier = this.getEtudiantIdentifier(etudiantItem);
        if (etudiantCollectionIdentifiers.includes(etudiantIdentifier)) {
          return false;
        }
        etudiantCollectionIdentifiers.push(etudiantIdentifier);
        return true;
      });
      return [...etudiantsToAdd, ...etudiantCollection];
    }
    return etudiantCollection;
  }
}
