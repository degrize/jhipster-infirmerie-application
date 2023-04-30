import { IPersonnel, NewPersonnel } from './personnel.model';

export const sampleWithRequiredData: IPersonnel = {
  id: 43543,
};

export const sampleWithPartialData: IPersonnel = {
  id: 49635,
  matricule: 'Frozen',
};

export const sampleWithFullData: IPersonnel = {
  id: 82229,
  matricule: 'PNG enhance',
};

export const sampleWithNewData: NewPersonnel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
