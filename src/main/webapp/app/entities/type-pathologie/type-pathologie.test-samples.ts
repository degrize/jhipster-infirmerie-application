import { ITypePathologie, NewTypePathologie } from './type-pathologie.model';

export const sampleWithRequiredData: ITypePathologie = {
  id: 91659,
};

export const sampleWithPartialData: ITypePathologie = {
  id: 84926,
};

export const sampleWithFullData: ITypePathologie = {
  id: 32721,
  typePathologie: 'red Account c',
};

export const sampleWithNewData: NewTypePathologie = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
