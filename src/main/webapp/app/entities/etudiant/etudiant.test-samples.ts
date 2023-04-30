import { IEtudiant, NewEtudiant } from './etudiant.model';

export const sampleWithRequiredData: IEtudiant = {
  id: 99461,
};

export const sampleWithPartialData: IEtudiant = {
  id: 34583,
};

export const sampleWithFullData: IEtudiant = {
  id: 23433,
  matricule: 'SQL Books B2C',
};

export const sampleWithNewData: NewEtudiant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
