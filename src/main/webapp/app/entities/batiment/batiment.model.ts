import { ISite } from 'app/entities/site/site.model';

export interface IBatiment {
  id: number;
  nom?: string | null;
  site?: Pick<ISite, 'id' | 'lieuSite'> | null;
}

export type NewBatiment = Omit<IBatiment, 'id'> & { id: null };
