import { IAntecedent, NewAntecedent } from './antecedent.model';

export const sampleWithRequiredData: IAntecedent = {
  id: 35067,
};

export const sampleWithPartialData: IAntecedent = {
  id: 25078,
};

export const sampleWithFullData: IAntecedent = {
  id: 94099,
  libAntecedent: 'Lari Car',
};

export const sampleWithNewData: NewAntecedent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
