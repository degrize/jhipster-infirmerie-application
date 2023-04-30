import { IPathologie, NewPathologie } from './pathologie.model';

export const sampleWithRequiredData: IPathologie = {
  id: 65517,
};

export const sampleWithPartialData: IPathologie = {
  id: 98997,
};

export const sampleWithFullData: IPathologie = {
  id: 13897,
  libellePathologie: 'olive Géorgie',
};

export const sampleWithNewData: NewPathologie = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
