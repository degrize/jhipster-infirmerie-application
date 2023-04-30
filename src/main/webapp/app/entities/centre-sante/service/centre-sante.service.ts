import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICentreSante, NewCentreSante } from '../centre-sante.model';

export type PartialUpdateCentreSante = Partial<ICentreSante> & Pick<ICentreSante, 'id'>;

export type EntityResponseType = HttpResponse<ICentreSante>;
export type EntityArrayResponseType = HttpResponse<ICentreSante[]>;

@Injectable({ providedIn: 'root' })
export class CentreSanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/centre-santes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(centreSante: NewCentreSante): Observable<EntityResponseType> {
    return this.http.post<ICentreSante>(this.resourceUrl, centreSante, { observe: 'response' });
  }

  update(centreSante: ICentreSante): Observable<EntityResponseType> {
    return this.http.put<ICentreSante>(`${this.resourceUrl}/${this.getCentreSanteIdentifier(centreSante)}`, centreSante, {
      observe: 'response',
    });
  }

  partialUpdate(centreSante: PartialUpdateCentreSante): Observable<EntityResponseType> {
    return this.http.patch<ICentreSante>(`${this.resourceUrl}/${this.getCentreSanteIdentifier(centreSante)}`, centreSante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICentreSante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICentreSante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCentreSanteIdentifier(centreSante: Pick<ICentreSante, 'id'>): number {
    return centreSante.id;
  }

  compareCentreSante(o1: Pick<ICentreSante, 'id'> | null, o2: Pick<ICentreSante, 'id'> | null): boolean {
    return o1 && o2 ? this.getCentreSanteIdentifier(o1) === this.getCentreSanteIdentifier(o2) : o1 === o2;
  }

  addCentreSanteToCollectionIfMissing<Type extends Pick<ICentreSante, 'id'>>(
    centreSanteCollection: Type[],
    ...centreSantesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const centreSantes: Type[] = centreSantesToCheck.filter(isPresent);
    if (centreSantes.length > 0) {
      const centreSanteCollectionIdentifiers = centreSanteCollection.map(
        centreSanteItem => this.getCentreSanteIdentifier(centreSanteItem)!
      );
      const centreSantesToAdd = centreSantes.filter(centreSanteItem => {
        const centreSanteIdentifier = this.getCentreSanteIdentifier(centreSanteItem);
        if (centreSanteCollectionIdentifiers.includes(centreSanteIdentifier)) {
          return false;
        }
        centreSanteCollectionIdentifiers.push(centreSanteIdentifier);
        return true;
      });
      return [...centreSantesToAdd, ...centreSanteCollection];
    }
    return centreSanteCollection;
  }
}
