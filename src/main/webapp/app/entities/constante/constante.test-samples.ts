import { IConstante, NewConstante } from './constante.model';

export const sampleWithRequiredData: IConstante = {
  id: 20294,
};

export const sampleWithPartialData: IConstante = {
  id: 52511,
  temperature: 96351,
  pouls: 12769,
};

export const sampleWithFullData: IConstante = {
  id: 92318,
  masse: 79302,
  temperature: 52829,
  taille: 10997,
  pouls: 90144,
};

export const sampleWithNewData: NewConstante = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
