export interface IConstante {
  id: number;
  masse?: number | null;
  temperature?: number | null;
  taille?: number | null;
  pouls?: number | null;
}

export type NewConstante = Omit<IConstante, 'id'> & { id: null };
