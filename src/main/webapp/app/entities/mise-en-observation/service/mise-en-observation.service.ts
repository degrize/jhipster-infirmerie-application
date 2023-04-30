import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMiseEnObservation, NewMiseEnObservation } from '../mise-en-observation.model';

export type PartialUpdateMiseEnObservation = Partial<IMiseEnObservation> & Pick<IMiseEnObservation, 'id'>;

type RestOf<T extends IMiseEnObservation | NewMiseEnObservation> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

export type RestMiseEnObservation = RestOf<IMiseEnObservation>;

export type NewRestMiseEnObservation = RestOf<NewMiseEnObservation>;

export type PartialUpdateRestMiseEnObservation = RestOf<PartialUpdateMiseEnObservation>;

export type EntityResponseType = HttpResponse<IMiseEnObservation>;
export type EntityArrayResponseType = HttpResponse<IMiseEnObservation[]>;

@Injectable({ providedIn: 'root' })
export class MiseEnObservationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mise-en-observations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(miseEnObservation: NewMiseEnObservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(miseEnObservation);
    return this.http
      .post<RestMiseEnObservation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(miseEnObservation: IMiseEnObservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(miseEnObservation);
    return this.http
      .put<RestMiseEnObservation>(`${this.resourceUrl}/${this.getMiseEnObservationIdentifier(miseEnObservation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(miseEnObservation: PartialUpdateMiseEnObservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(miseEnObservation);
    return this.http
      .patch<RestMiseEnObservation>(`${this.resourceUrl}/${this.getMiseEnObservationIdentifier(miseEnObservation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMiseEnObservation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMiseEnObservation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMiseEnObservationIdentifier(miseEnObservation: Pick<IMiseEnObservation, 'id'>): number {
    return miseEnObservation.id;
  }

  compareMiseEnObservation(o1: Pick<IMiseEnObservation, 'id'> | null, o2: Pick<IMiseEnObservation, 'id'> | null): boolean {
    return o1 && o2 ? this.getMiseEnObservationIdentifier(o1) === this.getMiseEnObservationIdentifier(o2) : o1 === o2;
  }

  addMiseEnObservationToCollectionIfMissing<Type extends Pick<IMiseEnObservation, 'id'>>(
    miseEnObservationCollection: Type[],
    ...miseEnObservationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const miseEnObservations: Type[] = miseEnObservationsToCheck.filter(isPresent);
    if (miseEnObservations.length > 0) {
      const miseEnObservationCollectionIdentifiers = miseEnObservationCollection.map(
        miseEnObservationItem => this.getMiseEnObservationIdentifier(miseEnObservationItem)!
      );
      const miseEnObservationsToAdd = miseEnObservations.filter(miseEnObservationItem => {
        const miseEnObservationIdentifier = this.getMiseEnObservationIdentifier(miseEnObservationItem);
        if (miseEnObservationCollectionIdentifiers.includes(miseEnObservationIdentifier)) {
          return false;
        }
        miseEnObservationCollectionIdentifiers.push(miseEnObservationIdentifier);
        return true;
      });
      return [...miseEnObservationsToAdd, ...miseEnObservationCollection];
    }
    return miseEnObservationCollection;
  }

  protected convertDateFromClient<T extends IMiseEnObservation | NewMiseEnObservation | PartialUpdateMiseEnObservation>(
    miseEnObservation: T
  ): RestOf<T> {
    return {
      ...miseEnObservation,
      dateDebut: miseEnObservation.dateDebut?.format(DATE_FORMAT) ?? null,
      dateFin: miseEnObservation.dateFin?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMiseEnObservation: RestMiseEnObservation): IMiseEnObservation {
    return {
      ...restMiseEnObservation,
      dateDebut: restMiseEnObservation.dateDebut ? dayjs(restMiseEnObservation.dateDebut) : undefined,
      dateFin: restMiseEnObservation.dateFin ? dayjs(restMiseEnObservation.dateFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMiseEnObservation>): HttpResponse<IMiseEnObservation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMiseEnObservation[]>): HttpResponse<IMiseEnObservation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
