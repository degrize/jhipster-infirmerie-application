import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRdv, NewRdv } from '../rdv.model';

export type PartialUpdateRdv = Partial<IRdv> & Pick<IRdv, 'id'>;

type RestOf<T extends IRdv | NewRdv> = Omit<T, 'dateRdv'> & {
  dateRdv?: string | null;
};

export type RestRdv = RestOf<IRdv>;

export type NewRestRdv = RestOf<NewRdv>;

export type PartialUpdateRestRdv = RestOf<PartialUpdateRdv>;

export type EntityResponseType = HttpResponse<IRdv>;
export type EntityArrayResponseType = HttpResponse<IRdv[]>;

@Injectable({ providedIn: 'root' })
export class RdvService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rdvs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rdv: NewRdv): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rdv);
    return this.http.post<RestRdv>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(rdv: IRdv): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rdv);
    return this.http
      .put<RestRdv>(`${this.resourceUrl}/${this.getRdvIdentifier(rdv)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(rdv: PartialUpdateRdv): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rdv);
    return this.http
      .patch<RestRdv>(`${this.resourceUrl}/${this.getRdvIdentifier(rdv)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRdv>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRdv[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRdvIdentifier(rdv: Pick<IRdv, 'id'>): number {
    return rdv.id;
  }

  compareRdv(o1: Pick<IRdv, 'id'> | null, o2: Pick<IRdv, 'id'> | null): boolean {
    return o1 && o2 ? this.getRdvIdentifier(o1) === this.getRdvIdentifier(o2) : o1 === o2;
  }

  addRdvToCollectionIfMissing<Type extends Pick<IRdv, 'id'>>(rdvCollection: Type[], ...rdvsToCheck: (Type | null | undefined)[]): Type[] {
    const rdvs: Type[] = rdvsToCheck.filter(isPresent);
    if (rdvs.length > 0) {
      const rdvCollectionIdentifiers = rdvCollection.map(rdvItem => this.getRdvIdentifier(rdvItem)!);
      const rdvsToAdd = rdvs.filter(rdvItem => {
        const rdvIdentifier = this.getRdvIdentifier(rdvItem);
        if (rdvCollectionIdentifiers.includes(rdvIdentifier)) {
          return false;
        }
        rdvCollectionIdentifiers.push(rdvIdentifier);
        return true;
      });
      return [...rdvsToAdd, ...rdvCollection];
    }
    return rdvCollection;
  }

  protected convertDateFromClient<T extends IRdv | NewRdv | PartialUpdateRdv>(rdv: T): RestOf<T> {
    return {
      ...rdv,
      dateRdv: rdv.dateRdv?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restRdv: RestRdv): IRdv {
    return {
      ...restRdv,
      dateRdv: restRdv.dateRdv ? dayjs(restRdv.dateRdv) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRdv>): HttpResponse<IRdv> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRdv[]>): HttpResponse<IRdv[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
