import dayjs from 'dayjs/esm';
import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IRdv {
  id: number;
  dateRdv?: dayjs.Dayjs | null;
  motif?: string | null;
  consultation?: Pick<IConsultation, 'id' | 'nom'> | null;
}

export type NewRdv = Omit<IRdv, 'id'> & { id: null };
