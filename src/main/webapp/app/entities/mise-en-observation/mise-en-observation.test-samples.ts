import dayjs from 'dayjs/esm';

import { IMiseEnObservation, NewMiseEnObservation } from './mise-en-observation.model';

export const sampleWithRequiredData: IMiseEnObservation = {
  id: 13756,
};

export const sampleWithPartialData: IMiseEnObservation = {
  id: 81012,
  dateDebut: dayjs('2023-04-30'),
  dateFin: dayjs('2023-04-30'),
  description: 'Berkshire',
};

export const sampleWithFullData: IMiseEnObservation = {
  id: 82789,
  dateDebut: dayjs('2023-04-30'),
  dateFin: dayjs('2023-04-30'),
  description: 'b Dollar',
};

export const sampleWithNewData: NewMiseEnObservation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
