import dayjs from 'dayjs/esm';

export interface IPatient {
  id: number;
  nom?: string | null;
  preNom?: string | null;
  dateNaissance?: dayjs.Dayjs | null;
  lieuNaissance?: string | null;
  sexe?: string | null;
  photo?: string | null;
  photoContentType?: string | null;
  contact?: string | null;
  statut?: string | null;
  tabac?: string | null;
  alcool?: string | null;
  sport?: string | null;
  cigarette?: string | null;
  contactParent?: string | null;
}

export type NewPatient = Omit<IPatient, 'id'> & { id: null };
