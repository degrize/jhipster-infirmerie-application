export interface ITypeConsultation {
  id: number;
  libelleTypeConsultation?: string | null;
}

export type NewTypeConsultation = Omit<ITypeConsultation, 'id'> & { id: null };
