import { IMedicament, NewMedicament } from './medicament.model';

export const sampleWithRequiredData: IMedicament = {
  id: 931,
};

export const sampleWithPartialData: IMedicament = {
  id: 39309,
  medicament: 'Sausages',
};

export const sampleWithFullData: IMedicament = {
  id: 63006,
  medicament: 'c',
};

export const sampleWithNewData: NewMedicament = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
