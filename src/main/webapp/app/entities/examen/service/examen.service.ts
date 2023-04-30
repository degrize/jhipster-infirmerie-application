import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExamen, NewExamen } from '../examen.model';

export type PartialUpdateExamen = Partial<IExamen> & Pick<IExamen, 'id'>;

export type EntityResponseType = HttpResponse<IExamen>;
export type EntityArrayResponseType = HttpResponse<IExamen[]>;

@Injectable({ providedIn: 'root' })
export class ExamenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/examen');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(examen: NewExamen): Observable<EntityResponseType> {
    return this.http.post<IExamen>(this.resourceUrl, examen, { observe: 'response' });
  }

  update(examen: IExamen): Observable<EntityResponseType> {
    return this.http.put<IExamen>(`${this.resourceUrl}/${this.getExamenIdentifier(examen)}`, examen, { observe: 'response' });
  }

  partialUpdate(examen: PartialUpdateExamen): Observable<EntityResponseType> {
    return this.http.patch<IExamen>(`${this.resourceUrl}/${this.getExamenIdentifier(examen)}`, examen, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExamen>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExamen[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExamenIdentifier(examen: Pick<IExamen, 'id'>): number {
    return examen.id;
  }

  compareExamen(o1: Pick<IExamen, 'id'> | null, o2: Pick<IExamen, 'id'> | null): boolean {
    return o1 && o2 ? this.getExamenIdentifier(o1) === this.getExamenIdentifier(o2) : o1 === o2;
  }

  addExamenToCollectionIfMissing<Type extends Pick<IExamen, 'id'>>(
    examenCollection: Type[],
    ...examenToCheck: (Type | null | undefined)[]
  ): Type[] {
    const examen: Type[] = examenToCheck.filter(isPresent);
    if (examen.length > 0) {
      const examenCollectionIdentifiers = examenCollection.map(examenItem => this.getExamenIdentifier(examenItem)!);
      const examenToAdd = examen.filter(examenItem => {
        const examenIdentifier = this.getExamenIdentifier(examenItem);
        if (examenCollectionIdentifiers.includes(examenIdentifier)) {
          return false;
        }
        examenCollectionIdentifiers.push(examenIdentifier);
        return true;
      });
      return [...examenToAdd, ...examenCollection];
    }
    return examenCollection;
  }
}
