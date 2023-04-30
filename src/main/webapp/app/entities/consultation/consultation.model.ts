import dayjs from 'dayjs/esm';
import { IConstante } from 'app/entities/constante/constante.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { IAgentSante } from 'app/entities/agent-sante/agent-sante.model';
import { IOrdonnance } from 'app/entities/ordonnance/ordonnance.model';
import { ITypeConsultation } from 'app/entities/type-consultation/type-consultation.model';
import { IPathologie } from 'app/entities/pathologie/pathologie.model';

export interface IConsultation {
  id: number;
  dateConsultation?: dayjs.Dayjs | null;
  motif?: string | null;
  diagnostic?: string | null;
  consultationObservation?: string | null;
  constante?: Pick<IConstante, 'id'> | null;
  patient?: Pick<IPatient, 'id' | 'motif'> | null;
  agentSante?: Pick<IAgentSante, 'id' | 'nom'> | null;
  ordonnance?: Pick<IOrdonnance, 'id' | 'ordonnanceDescription'> | null;
  typeConsultation?: Pick<ITypeConsultation, 'id' | 'libelleTypeConsultation'> | null;
  pathologies?: Pick<IPathologie, 'id' | 'libellePathologie'>[] | null;
}

export type NewConsultation = Omit<IConsultation, 'id'> & { id: null };
