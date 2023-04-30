import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConstante, NewConstante } from '../constante.model';

export type PartialUpdateConstante = Partial<IConstante> & Pick<IConstante, 'id'>;

export type EntityResponseType = HttpResponse<IConstante>;
export type EntityArrayResponseType = HttpResponse<IConstante[]>;

@Injectable({ providedIn: 'root' })
export class ConstanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/constantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(constante: NewConstante): Observable<EntityResponseType> {
    return this.http.post<IConstante>(this.resourceUrl, constante, { observe: 'response' });
  }

  update(constante: IConstante): Observable<EntityResponseType> {
    return this.http.put<IConstante>(`${this.resourceUrl}/${this.getConstanteIdentifier(constante)}`, constante, { observe: 'response' });
  }

  partialUpdate(constante: PartialUpdateConstante): Observable<EntityResponseType> {
    return this.http.patch<IConstante>(`${this.resourceUrl}/${this.getConstanteIdentifier(constante)}`, constante, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConstante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConstante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConstanteIdentifier(constante: Pick<IConstante, 'id'>): number {
    return constante.id;
  }

  compareConstante(o1: Pick<IConstante, 'id'> | null, o2: Pick<IConstante, 'id'> | null): boolean {
    return o1 && o2 ? this.getConstanteIdentifier(o1) === this.getConstanteIdentifier(o2) : o1 === o2;
  }

  addConstanteToCollectionIfMissing<Type extends Pick<IConstante, 'id'>>(
    constanteCollection: Type[],
    ...constantesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const constantes: Type[] = constantesToCheck.filter(isPresent);
    if (constantes.length > 0) {
      const constanteCollectionIdentifiers = constanteCollection.map(constanteItem => this.getConstanteIdentifier(constanteItem)!);
      const constantesToAdd = constantes.filter(constanteItem => {
        const constanteIdentifier = this.getConstanteIdentifier(constanteItem);
        if (constanteCollectionIdentifiers.includes(constanteIdentifier)) {
          return false;
        }
        constanteCollectionIdentifiers.push(constanteIdentifier);
        return true;
      });
      return [...constantesToAdd, ...constanteCollection];
    }
    return constanteCollection;
  }
}
