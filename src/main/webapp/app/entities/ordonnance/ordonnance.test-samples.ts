import { IOrdonnance, NewOrdonnance } from './ordonnance.model';

export const sampleWithRequiredData: IOrdonnance = {
  id: 30275,
};

export const sampleWithPartialData: IOrdonnance = {
  id: 81639,
  ordonnanceDescription: 'Bourgogne Metal Nord-Pas-de-Calais',
};

export const sampleWithFullData: IOrdonnance = {
  id: 97296,
  ordonnanceDescription: 'Bedfordshire Poitou-Charentes Kip',
};

export const sampleWithNewData: NewOrdonnance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
