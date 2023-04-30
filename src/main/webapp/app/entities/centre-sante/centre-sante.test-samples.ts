import { ICentreSante, NewCentreSante } from './centre-sante.model';

export const sampleWithRequiredData: ICentreSante = {
  id: 85365,
};

export const sampleWithPartialData: ICentreSante = {
  id: 50179,
  nom: 'multi-byte Belize',
  contact: 'deposit',
  email: 'Hincmar_Bertrand@gmail.com',
};

export const sampleWithFullData: ICentreSante = {
  id: 33541,
  nom: 'sexy human-resource',
  adresse: 'wireless',
  contact: 'Papouasie-Nouvelle-Guinée',
  email: 'Elsa33@gmail.com',
  numeroMatriculation: 'productivity',
};

export const sampleWithNewData: NewCentreSante = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
