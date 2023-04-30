import { ISpecialite, NewSpecialite } from './specialite.model';

export const sampleWithRequiredData: ISpecialite = {
  id: 39418,
};

export const sampleWithPartialData: ISpecialite = {
  id: 70060,
  specialite: 'Steel Virtual Plastic',
};

export const sampleWithFullData: ISpecialite = {
  id: 4843,
  specialite: "Chaussée-d'Antin input methodologies",
};

export const sampleWithNewData: NewSpecialite = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
