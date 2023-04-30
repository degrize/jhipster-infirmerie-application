import { IPatient } from 'app/entities/patient/patient.model';

export interface IAntecedent {
  id: number;
  libAntecedent?: string | null;
  patient?: Pick<IPatient, 'id' | 'nom'> | null;
}

export type NewAntecedent = Omit<IAntecedent, 'id'> & { id: null };
