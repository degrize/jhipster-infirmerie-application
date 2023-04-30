import { IAgentSante } from 'app/entities/agent-sante/agent-sante.model';

export interface ITypeAgent {
  id: number;
  typeAgent?: string | null;
  agentSante?: Pick<IAgentSante, 'id' | 'nom'> | null;
}

export type NewTypeAgent = Omit<ITypeAgent, 'id'> & { id: null };
