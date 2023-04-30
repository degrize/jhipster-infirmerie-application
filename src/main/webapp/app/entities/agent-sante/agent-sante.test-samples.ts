import { IAgentSante, NewAgentSante } from './agent-sante.model';

export const sampleWithRequiredData: IAgentSante = {
  id: 96284,
};

export const sampleWithPartialData: IAgentSante = {
  id: 6083,
  nom: 'Grenade Plastic',
  contact: 'TCP synthesize drive',
  adresse: 'Consultant revolutionary Rustic',
  login: 'a',
};

export const sampleWithFullData: IAgentSante = {
  id: 13686,
  nom: 'withdrawal',
  prenom: 'Borders Lempira Cambridgeshire',
  contact: 'system Down-sized b',
  adresse: 'backing invoice',
  login: 'Gorgeous',
  motDePasse: 'XML c moderator',
};

export const sampleWithNewData: NewAgentSante = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
