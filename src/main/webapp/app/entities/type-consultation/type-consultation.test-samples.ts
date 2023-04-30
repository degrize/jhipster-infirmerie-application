import { ITypeConsultation, NewTypeConsultation } from './type-consultation.model';

export const sampleWithRequiredData: ITypeConsultation = {
  id: 42954,
};

export const sampleWithPartialData: ITypeConsultation = {
  id: 2785,
  libelleTypeConsultation: 'connect',
};

export const sampleWithFullData: ITypeConsultation = {
  id: 80368,
  libelleTypeConsultation: 'neural-net Tilsitt Serbie',
};

export const sampleWithNewData: NewTypeConsultation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
