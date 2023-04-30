import { IBatiment } from 'app/entities/batiment/batiment.model';

export interface IChambre {
  id: number;
  numeroChambre?: number | null;
  batiment?: Pick<IBatiment, 'id' | 'batimentLibelle'> | null;
}

export type NewChambre = Omit<IChambre, 'id'> & { id: null };
