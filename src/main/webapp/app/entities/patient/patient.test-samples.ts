import dayjs from 'dayjs/esm';

import { IPatient, NewPatient } from './patient.model';

export const sampleWithRequiredData: IPatient = {
  id: 39843,
};

export const sampleWithPartialData: IPatient = {
  id: 58023,
  preNom: 'Ameliorated Industrial networks',
  lieuNaissance: 'Soft Congolese',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  contact: 'Denar orchestrate channels',
  tabac: 'Steel synthesize b',
  sport: 'b programming Loan',
  contactParent: 'c c',
};

export const sampleWithFullData: IPatient = {
  id: 94087,
  nom: 'Gloves functionalities',
  preNom: 'maroon stable',
  dateNaissance: dayjs('2023-04-30'),
  lieuNaissance: 'Automated',
  sexe: 'non-volatile Wooden Avon',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  contact: 'driver yellow',
  statut: 'Solférino Djibouti',
  tabac: 'indexing',
  alcool: 'bus',
  sport: 'SMTP seize',
  cigarette: 'panel Canada maroon',
  contactParent: 'withdrawal',
};

export const sampleWithNewData: NewPatient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
