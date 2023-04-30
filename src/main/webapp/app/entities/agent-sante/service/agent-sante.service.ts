import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgentSante, NewAgentSante } from '../agent-sante.model';

export type PartialUpdateAgentSante = Partial<IAgentSante> & Pick<IAgentSante, 'id'>;

export type EntityResponseType = HttpResponse<IAgentSante>;
export type EntityArrayResponseType = HttpResponse<IAgentSante[]>;

@Injectable({ providedIn: 'root' })
export class AgentSanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/agent-santes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(agentSante: NewAgentSante): Observable<EntityResponseType> {
    return this.http.post<IAgentSante>(this.resourceUrl, agentSante, { observe: 'response' });
  }

  update(agentSante: IAgentSante): Observable<EntityResponseType> {
    return this.http.put<IAgentSante>(`${this.resourceUrl}/${this.getAgentSanteIdentifier(agentSante)}`, agentSante, {
      observe: 'response',
    });
  }

  partialUpdate(agentSante: PartialUpdateAgentSante): Observable<EntityResponseType> {
    return this.http.patch<IAgentSante>(`${this.resourceUrl}/${this.getAgentSanteIdentifier(agentSante)}`, agentSante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAgentSante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAgentSante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAgentSanteIdentifier(agentSante: Pick<IAgentSante, 'id'>): number {
    return agentSante.id;
  }

  compareAgentSante(o1: Pick<IAgentSante, 'id'> | null, o2: Pick<IAgentSante, 'id'> | null): boolean {
    return o1 && o2 ? this.getAgentSanteIdentifier(o1) === this.getAgentSanteIdentifier(o2) : o1 === o2;
  }

  addAgentSanteToCollectionIfMissing<Type extends Pick<IAgentSante, 'id'>>(
    agentSanteCollection: Type[],
    ...agentSantesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const agentSantes: Type[] = agentSantesToCheck.filter(isPresent);
    if (agentSantes.length > 0) {
      const agentSanteCollectionIdentifiers = agentSanteCollection.map(agentSanteItem => this.getAgentSanteIdentifier(agentSanteItem)!);
      const agentSantesToAdd = agentSantes.filter(agentSanteItem => {
        const agentSanteIdentifier = this.getAgentSanteIdentifier(agentSanteItem);
        if (agentSanteCollectionIdentifiers.includes(agentSanteIdentifier)) {
          return false;
        }
        agentSanteCollectionIdentifiers.push(agentSanteIdentifier);
        return true;
      });
      return [...agentSantesToAdd, ...agentSanteCollection];
    }
    return agentSanteCollection;
  }
}
