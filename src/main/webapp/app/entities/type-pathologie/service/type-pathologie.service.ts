import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypePathologie, NewTypePathologie } from '../type-pathologie.model';

export type PartialUpdateTypePathologie = Partial<ITypePathologie> & Pick<ITypePathologie, 'id'>;

export type EntityResponseType = HttpResponse<ITypePathologie>;
export type EntityArrayResponseType = HttpResponse<ITypePathologie[]>;

@Injectable({ providedIn: 'root' })
export class TypePathologieService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-pathologies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typePathologie: NewTypePathologie): Observable<EntityResponseType> {
    return this.http.post<ITypePathologie>(this.resourceUrl, typePathologie, { observe: 'response' });
  }

  update(typePathologie: ITypePathologie): Observable<EntityResponseType> {
    return this.http.put<ITypePathologie>(`${this.resourceUrl}/${this.getTypePathologieIdentifier(typePathologie)}`, typePathologie, {
      observe: 'response',
    });
  }

  partialUpdate(typePathologie: PartialUpdateTypePathologie): Observable<EntityResponseType> {
    return this.http.patch<ITypePathologie>(`${this.resourceUrl}/${this.getTypePathologieIdentifier(typePathologie)}`, typePathologie, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypePathologie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypePathologie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTypePathologieIdentifier(typePathologie: Pick<ITypePathologie, 'id'>): number {
    return typePathologie.id;
  }

  compareTypePathologie(o1: Pick<ITypePathologie, 'id'> | null, o2: Pick<ITypePathologie, 'id'> | null): boolean {
    return o1 && o2 ? this.getTypePathologieIdentifier(o1) === this.getTypePathologieIdentifier(o2) : o1 === o2;
  }

  addTypePathologieToCollectionIfMissing<Type extends Pick<ITypePathologie, 'id'>>(
    typePathologieCollection: Type[],
    ...typePathologiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const typePathologies: Type[] = typePathologiesToCheck.filter(isPresent);
    if (typePathologies.length > 0) {
      const typePathologieCollectionIdentifiers = typePathologieCollection.map(
        typePathologieItem => this.getTypePathologieIdentifier(typePathologieItem)!
      );
      const typePathologiesToAdd = typePathologies.filter(typePathologieItem => {
        const typePathologieIdentifier = this.getTypePathologieIdentifier(typePathologieItem);
        if (typePathologieCollectionIdentifiers.includes(typePathologieIdentifier)) {
          return false;
        }
        typePathologieCollectionIdentifiers.push(typePathologieIdentifier);
        return true;
      });
      return [...typePathologiesToAdd, ...typePathologieCollection];
    }
    return typePathologieCollection;
  }
}
