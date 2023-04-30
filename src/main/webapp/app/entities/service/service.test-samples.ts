import { IService, NewService } from './service.model';

export const sampleWithRequiredData: IService = {
  id: 12311,
};

export const sampleWithPartialData: IService = {
  id: 95115,
};

export const sampleWithFullData: IService = {
  id: 92312,
  nom: 'asymmetric',
};

export const sampleWithNewData: NewService = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
