export interface IService {
  id: number;
  nom?: string | null;
}

export type NewService = Omit<IService, 'id'> & { id: null };
