import { IAgentSante } from 'app/entities/agent-sante/agent-sante.model';

export interface ISpecialite {
  id: number;
  specialite?: string | null;
  agentSantes?: Pick<IAgentSante, 'id' | 'nom'>[] | null;
}

export type NewSpecialite = Omit<ISpecialite, 'id'> & { id: null };
