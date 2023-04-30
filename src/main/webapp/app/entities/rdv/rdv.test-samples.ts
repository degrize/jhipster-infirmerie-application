import dayjs from 'dayjs/esm';

import { IRdv, NewRdv } from './rdv.model';

export const sampleWithRequiredData: IRdv = {
  id: 38807,
};

export const sampleWithPartialData: IRdv = {
  id: 84842,
  dateRdv: dayjs('2023-04-30'),
};

export const sampleWithFullData: IRdv = {
  id: 7929,
  dateRdv: dayjs('2023-04-30'),
  motif: 'synthesize',
};

export const sampleWithNewData: NewRdv = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
