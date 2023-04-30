import { ITypeMedicament } from 'app/entities/type-medicament/type-medicament.model';
import { IOrdonnance } from 'app/entities/ordonnance/ordonnance.model';

export interface IMedicament {
  id: number;
  medicament?: string | null;
  typeMedicament?: Pick<ITypeMedicament, 'id' | 'typeMedicament'> | null;
  ordonnance?: Pick<IOrdonnance, 'id' | 'ordonnanceDescription'> | null;
}

export type NewMedicament = Omit<IMedicament, 'id'> & { id: null };
