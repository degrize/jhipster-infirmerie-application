import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPathologie, NewPathologie } from '../pathologie.model';

export type PartialUpdatePathologie = Partial<IPathologie> & Pick<IPathologie, 'id'>;

export type EntityResponseType = HttpResponse<IPathologie>;
export type EntityArrayResponseType = HttpResponse<IPathologie[]>;

@Injectable({ providedIn: 'root' })
export class PathologieService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pathologies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pathologie: NewPathologie): Observable<EntityResponseType> {
    return this.http.post<IPathologie>(this.resourceUrl, pathologie, { observe: 'response' });
  }

  update(pathologie: IPathologie): Observable<EntityResponseType> {
    return this.http.put<IPathologie>(`${this.resourceUrl}/${this.getPathologieIdentifier(pathologie)}`, pathologie, {
      observe: 'response',
    });
  }

  partialUpdate(pathologie: PartialUpdatePathologie): Observable<EntityResponseType> {
    return this.http.patch<IPathologie>(`${this.resourceUrl}/${this.getPathologieIdentifier(pathologie)}`, pathologie, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPathologie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPathologie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPathologieIdentifier(pathologie: Pick<IPathologie, 'id'>): number {
    return pathologie.id;
  }

  comparePathologie(o1: Pick<IPathologie, 'id'> | null, o2: Pick<IPathologie, 'id'> | null): boolean {
    return o1 && o2 ? this.getPathologieIdentifier(o1) === this.getPathologieIdentifier(o2) : o1 === o2;
  }

  addPathologieToCollectionIfMissing<Type extends Pick<IPathologie, 'id'>>(
    pathologieCollection: Type[],
    ...pathologiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pathologies: Type[] = pathologiesToCheck.filter(isPresent);
    if (pathologies.length > 0) {
      const pathologieCollectionIdentifiers = pathologieCollection.map(pathologieItem => this.getPathologieIdentifier(pathologieItem)!);
      const pathologiesToAdd = pathologies.filter(pathologieItem => {
        const pathologieIdentifier = this.getPathologieIdentifier(pathologieItem);
        if (pathologieCollectionIdentifiers.includes(pathologieIdentifier)) {
          return false;
        }
        pathologieCollectionIdentifiers.push(pathologieIdentifier);
        return true;
      });
      return [...pathologiesToAdd, ...pathologieCollection];
    }
    return pathologieCollection;
  }
}
