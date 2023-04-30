export interface IOrdonnance {
  id: number;
  ordonnanceDescription?: string | null;
}

export type NewOrdonnance = Omit<IOrdonnance, 'id'> & { id: null };
