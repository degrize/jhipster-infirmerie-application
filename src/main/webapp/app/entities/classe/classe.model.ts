export interface IClasse {
  id: number;
  nom?: string | null;
}

export type NewClasse = Omit<IClasse, 'id'> & { id: null };
