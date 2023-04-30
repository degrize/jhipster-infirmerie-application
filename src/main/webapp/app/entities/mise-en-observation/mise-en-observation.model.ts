import dayjs from 'dayjs/esm';
import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IMiseEnObservation {
  id: number;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  description?: string | null;
  miseEnObservation?: Pick<IConsultation, 'id' | 'description'> | null;
}

export type NewMiseEnObservation = Omit<IMiseEnObservation, 'id'> & { id: null };
