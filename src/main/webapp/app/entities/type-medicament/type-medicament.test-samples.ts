import { ITypeMedicament, NewTypeMedicament } from './type-medicament.model';

export const sampleWithRequiredData: ITypeMedicament = {
  id: 18084,
};

export const sampleWithPartialData: ITypeMedicament = {
  id: 9740,
};

export const sampleWithFullData: ITypeMedicament = {
  id: 49181,
  typeMedicament: 'b ADP',
};

export const sampleWithNewData: NewTypeMedicament = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
