import { IExamen, NewExamen } from './examen.model';

export const sampleWithRequiredData: IExamen = {
  id: 47763,
};

export const sampleWithPartialData: IExamen = {
  id: 26138,
};

export const sampleWithFullData: IExamen = {
  id: 58273,
  examenLibelle: 'Fish',
};

export const sampleWithNewData: NewExamen = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
