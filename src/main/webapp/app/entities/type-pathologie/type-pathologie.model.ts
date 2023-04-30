export interface ITypePathologie {
  id: number;
  typePathologie?: string | null;
}

export type NewTypePathologie = Omit<ITypePathologie, 'id'> & { id: null };
