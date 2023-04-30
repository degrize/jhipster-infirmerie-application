import { ITypePathologie } from 'app/entities/type-pathologie/type-pathologie.model';
import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IPathologie {
  id: number;
  libellePathologie?: string | null;
  typePathologie?: Pick<ITypePathologie, 'id' | 'typePathologie'> | null;
  consultations?: Pick<IConsultation, 'id' | 'nom'>[] | null;
}

export type NewPathologie = Omit<IPathologie, 'id'> & { id: null };
