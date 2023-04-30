export interface ITypeMedicament {
  id: number;
  typeMedicament?: string | null;
}

export type NewTypeMedicament = Omit<ITypeMedicament, 'id'> & { id: null };
