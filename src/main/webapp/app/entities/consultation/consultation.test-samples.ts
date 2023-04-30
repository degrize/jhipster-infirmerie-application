import dayjs from 'dayjs/esm';

import { IConsultation, NewConsultation } from './consultation.model';

export const sampleWithRequiredData: IConsultation = {
  id: 57781,
};

export const sampleWithPartialData: IConsultation = {
  id: 52619,
  motif: 'Toys',
  consultationObservation: 'Poitou-Charentes fuchsia',
};

export const sampleWithFullData: IConsultation = {
  id: 95549,
  dateConsultation: dayjs('2023-04-30'),
  motif: 'deposit connect heuristic',
  diagnostic: 'withdrawal Avon orange',
  consultationObservation: 'generate',
};

export const sampleWithNewData: NewConsultation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
