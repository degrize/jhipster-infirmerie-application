export interface ISite {
  id: number;
  site?: string | null;
}

export type NewSite = Omit<ISite, 'id'> & { id: null };
