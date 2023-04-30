import { ISite, NewSite } from './site.model';

export const sampleWithRequiredData: ISite = {
  id: 70275,
};

export const sampleWithPartialData: ISite = {
  id: 44832,
};

export const sampleWithFullData: ISite = {
  id: 46806,
  site: 'Cotton',
};

export const sampleWithNewData: NewSite = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
