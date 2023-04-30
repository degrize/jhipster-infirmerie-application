export interface IEcole {
  id: number;
  nom?: string | null;
}

export type NewEcole = Omit<IEcole, 'id'> & { id: null };
