import { IEcole, NewEcole } from './ecole.model';

export const sampleWithRequiredData: IEcole = {
  id: 90152,
};

export const sampleWithPartialData: IEcole = {
  id: 27024,
  nom: 'knowledge',
};

export const sampleWithFullData: IEcole = {
  id: 14142,
  nom: 'a Faubourg-Saint-Denis b',
};

export const sampleWithNewData: NewEcole = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
