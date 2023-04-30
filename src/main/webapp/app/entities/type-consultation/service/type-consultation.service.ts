import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeConsultation, NewTypeConsultation } from '../type-consultation.model';

export type PartialUpdateTypeConsultation = Partial<ITypeConsultation> & Pick<ITypeConsultation, 'id'>;

export type EntityResponseType = HttpResponse<ITypeConsultation>;
export type EntityArrayResponseType = HttpResponse<ITypeConsultation[]>;

@Injectable({ providedIn: 'root' })
export class TypeConsultationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-consultations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeConsultation: NewTypeConsultation): Observable<EntityResponseType> {
    return this.http.post<ITypeConsultation>(this.resourceUrl, typeConsultation, { observe: 'response' });
  }

  update(typeConsultation: ITypeConsultation): Observable<EntityResponseType> {
    return this.http.put<ITypeConsultation>(
      `${this.resourceUrl}/${this.getTypeConsultationIdentifier(typeConsultation)}`,
      typeConsultation,
      { observe: 'response' }
    );
  }

  partialUpdate(typeConsultation: PartialUpdateTypeConsultation): Observable<EntityResponseType> {
    return this.http.patch<ITypeConsultation>(
      `${this.resourceUrl}/${this.getTypeConsultationIdentifier(typeConsultation)}`,
      typeConsultation,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeConsultation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeConsultation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTypeConsultationIdentifier(typeConsultation: Pick<ITypeConsultation, 'id'>): number {
    return typeConsultation.id;
  }

  compareTypeConsultation(o1: Pick<ITypeConsultation, 'id'> | null, o2: Pick<ITypeConsultation, 'id'> | null): boolean {
    return o1 && o2 ? this.getTypeConsultationIdentifier(o1) === this.getTypeConsultationIdentifier(o2) : o1 === o2;
  }

  addTypeConsultationToCollectionIfMissing<Type extends Pick<ITypeConsultation, 'id'>>(
    typeConsultationCollection: Type[],
    ...typeConsultationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const typeConsultations: Type[] = typeConsultationsToCheck.filter(isPresent);
    if (typeConsultations.length > 0) {
      const typeConsultationCollectionIdentifiers = typeConsultationCollection.map(
        typeConsultationItem => this.getTypeConsultationIdentifier(typeConsultationItem)!
      );
      const typeConsultationsToAdd = typeConsultations.filter(typeConsultationItem => {
        const typeConsultationIdentifier = this.getTypeConsultationIdentifier(typeConsultationItem);
        if (typeConsultationCollectionIdentifiers.includes(typeConsultationIdentifier)) {
          return false;
        }
        typeConsultationCollectionIdentifiers.push(typeConsultationIdentifier);
        return true;
      });
      return [...typeConsultationsToAdd, ...typeConsultationCollection];
    }
    return typeConsultationCollection;
  }
}
