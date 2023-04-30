import { IPatient } from 'app/entities/patient/patient.model';
import { IService } from 'app/entities/service/service.model';

export interface IPersonnel {
  id: number;
  matricule?: string | null;
  patient?: Pick<IPatient, 'id' | 'motif'> | null;
  service?: Pick<IService, 'id' | 'nom'> | null;
}

export type NewPersonnel = Omit<IPersonnel, 'id'> & { id: null };
