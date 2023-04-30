import { ISpecialite } from 'app/entities/specialite/specialite.model';

export interface IAgentSante {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  contact?: string | null;
  adresse?: string | null;
  login?: string | null;
  motDePasse?: string | null;
  specialites?: Pick<ISpecialite, 'id' | 'specialite'>[] | null;
}

export type NewAgentSante = Omit<IAgentSante, 'id'> & { id: null };
