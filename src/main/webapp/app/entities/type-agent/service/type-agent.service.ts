import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeAgent, NewTypeAgent } from '../type-agent.model';

export type PartialUpdateTypeAgent = Partial<ITypeAgent> & Pick<ITypeAgent, 'id'>;

export type EntityResponseType = HttpResponse<ITypeAgent>;
export type EntityArrayResponseType = HttpResponse<ITypeAgent[]>;

@Injectable({ providedIn: 'root' })
export class TypeAgentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-agents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeAgent: NewTypeAgent): Observable<EntityResponseType> {
    return this.http.post<ITypeAgent>(this.resourceUrl, typeAgent, { observe: 'response' });
  }

  update(typeAgent: ITypeAgent): Observable<EntityResponseType> {
    return this.http.put<ITypeAgent>(`${this.resourceUrl}/${this.getTypeAgentIdentifier(typeAgent)}`, typeAgent, { observe: 'response' });
  }

  partialUpdate(typeAgent: PartialUpdateTypeAgent): Observable<EntityResponseType> {
    return this.http.patch<ITypeAgent>(`${this.resourceUrl}/${this.getTypeAgentIdentifier(typeAgent)}`, typeAgent, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeAgent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeAgent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTypeAgentIdentifier(typeAgent: Pick<ITypeAgent, 'id'>): number {
    return typeAgent.id;
  }

  compareTypeAgent(o1: Pick<ITypeAgent, 'id'> | null, o2: Pick<ITypeAgent, 'id'> | null): boolean {
    return o1 && o2 ? this.getTypeAgentIdentifier(o1) === this.getTypeAgentIdentifier(o2) : o1 === o2;
  }

  addTypeAgentToCollectionIfMissing<Type extends Pick<ITypeAgent, 'id'>>(
    typeAgentCollection: Type[],
    ...typeAgentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const typeAgents: Type[] = typeAgentsToCheck.filter(isPresent);
    if (typeAgents.length > 0) {
      const typeAgentCollectionIdentifiers = typeAgentCollection.map(typeAgentItem => this.getTypeAgentIdentifier(typeAgentItem)!);
      const typeAgentsToAdd = typeAgents.filter(typeAgentItem => {
        const typeAgentIdentifier = this.getTypeAgentIdentifier(typeAgentItem);
        if (typeAgentCollectionIdentifiers.includes(typeAgentIdentifier)) {
          return false;
        }
        typeAgentCollectionIdentifiers.push(typeAgentIdentifier);
        return true;
      });
      return [...typeAgentsToAdd, ...typeAgentCollection];
    }
    return typeAgentCollection;
  }
}
