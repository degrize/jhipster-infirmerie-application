import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConsultation, NewConsultation } from '../consultation.model';

export type PartialUpdateConsultation = Partial<IConsultation> & Pick<IConsultation, 'id'>;

type RestOf<T extends IConsultation | NewConsultation> = Omit<T, 'dateConsultation'> & {
  dateConsultation?: string | null;
};

export type RestConsultation = RestOf<IConsultation>;

export type NewRestConsultation = RestOf<NewConsultation>;

export type PartialUpdateRestConsultation = RestOf<PartialUpdateConsultation>;

export type EntityResponseType = HttpResponse<IConsultation>;
export type EntityArrayResponseType = HttpResponse<IConsultation[]>;

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/consultations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(consultation: NewConsultation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultation);
    return this.http
      .post<RestConsultation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(consultation: IConsultation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultation);
    return this.http
      .put<RestConsultation>(`${this.resourceUrl}/${this.getConsultationIdentifier(consultation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(consultation: PartialUpdateConsultation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultation);
    return this.http
      .patch<RestConsultation>(`${this.resourceUrl}/${this.getConsultationIdentifier(consultation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConsultation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConsultation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConsultationIdentifier(consultation: Pick<IConsultation, 'id'>): number {
    return consultation.id;
  }

  compareConsultation(o1: Pick<IConsultation, 'id'> | null, o2: Pick<IConsultation, 'id'> | null): boolean {
    return o1 && o2 ? this.getConsultationIdentifier(o1) === this.getConsultationIdentifier(o2) : o1 === o2;
  }

  addConsultationToCollectionIfMissing<Type extends Pick<IConsultation, 'id'>>(
    consultationCollection: Type[],
    ...consultationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const consultations: Type[] = consultationsToCheck.filter(isPresent);
    if (consultations.length > 0) {
      const consultationCollectionIdentifiers = consultationCollection.map(
        consultationItem => this.getConsultationIdentifier(consultationItem)!
      );
      const consultationsToAdd = consultations.filter(consultationItem => {
        const consultationIdentifier = this.getConsultationIdentifier(consultationItem);
        if (consultationCollectionIdentifiers.includes(consultationIdentifier)) {
          return false;
        }
        consultationCollectionIdentifiers.push(consultationIdentifier);
        return true;
      });
      return [...consultationsToAdd, ...consultationCollection];
    }
    return consultationCollection;
  }

  protected convertDateFromClient<T extends IConsultation | NewConsultation | PartialUpdateConsultation>(consultation: T): RestOf<T> {
    return {
      ...consultation,
      dateConsultation: consultation.dateConsultation?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restConsultation: RestConsultation): IConsultation {
    return {
      ...restConsultation,
      dateConsultation: restConsultation.dateConsultation ? dayjs(restConsultation.dateConsultation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConsultation>): HttpResponse<IConsultation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConsultation[]>): HttpResponse<IConsultation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
