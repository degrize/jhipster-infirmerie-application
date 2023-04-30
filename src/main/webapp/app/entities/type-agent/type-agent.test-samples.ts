import { ITypeAgent, NewTypeAgent } from './type-agent.model';

export const sampleWithRequiredData: ITypeAgent = {
  id: 60640,
};

export const sampleWithPartialData: ITypeAgent = {
  id: 28132,
};

export const sampleWithFullData: ITypeAgent = {
  id: 72354,
  typeAgent: 'optimal Ball',
};

export const sampleWithNewData: NewTypeAgent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
