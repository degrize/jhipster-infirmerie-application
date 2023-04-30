import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IExamen {
  id: number;
  examenLibelle?: string | null;
  consultation?: Pick<IConsultation, 'id' | 'motif'> | null;
}

export type NewExamen = Omit<IExamen, 'id'> & { id: null };
