export interface ICentreSante {
  id: number;
  nom?: string | null;
  adresse?: string | null;
  contact?: string | null;
  email?: string | null;
  numeroMatriculation?: string | null;
}

export type NewCentreSante = Omit<ICentreSante, 'id'> & { id: null };
