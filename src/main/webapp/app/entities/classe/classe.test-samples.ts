import { IClasse, NewClasse } from './classe.model';

export const sampleWithRequiredData: IClasse = {
  id: 50071,
};

export const sampleWithPartialData: IClasse = {
  id: 70196,
};

export const sampleWithFullData: IClasse = {
  id: 64183,
  nom: 'Pizza revolutionize',
};

export const sampleWithNewData: NewClasse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
