import { IBatiment, NewBatiment } from './batiment.model';

export const sampleWithRequiredData: IBatiment = {
  id: 22182,
};

export const sampleWithPartialData: IBatiment = {
  id: 60744,
  nom: 'compress Account',
};

export const sampleWithFullData: IBatiment = {
  id: 75048,
  nom: 'tan Azerbaïdjan cross-platform',
};

export const sampleWithNewData: NewBatiment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
