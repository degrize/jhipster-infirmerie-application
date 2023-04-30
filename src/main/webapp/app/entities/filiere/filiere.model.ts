import { IClasse } from 'app/entities/classe/classe.model';
import { IEcole } from 'app/entities/ecole/ecole.model';
import { Cycle } from 'app/entities/enumerations/cycle.model';

export interface IFiliere {
  id: number;
  nom?: string | null;
  cycle?: Cycle | null;
  classe?: Pick<IClasse, 'id' | 'nom'> | null;
  ecole?: Pick<IEcole, 'id' | 'nom'> | null;
}

export type NewFiliere = Omit<IFiliere, 'id'> & { id: null };
