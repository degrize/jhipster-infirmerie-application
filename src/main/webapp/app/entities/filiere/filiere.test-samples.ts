import { Cycle } from 'app/entities/enumerations/cycle.model';

import { IFiliere, NewFiliere } from './filiere.model';

export const sampleWithRequiredData: IFiliere = {
  id: 65746,
};

export const sampleWithPartialData: IFiliere = {
  id: 51175,
  nom: 'convergence Re-contextualized Seamless',
};

export const sampleWithFullData: IFiliere = {
  id: 34024,
  nom: 'back-end enhance Bedfordshire',
  cycle: Cycle['TS'],
};

export const sampleWithNewData: NewFiliere = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
