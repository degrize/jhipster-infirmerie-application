import { IChambre, NewChambre } from './chambre.model';

export const sampleWithRequiredData: IChambre = {
  id: 74426,
};

export const sampleWithPartialData: IChambre = {
  id: 33575,
  numeroChambre: 87146,
};

export const sampleWithFullData: IChambre = {
  id: 27242,
  numeroChambre: 75664,
};

export const sampleWithNewData: NewChambre = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
