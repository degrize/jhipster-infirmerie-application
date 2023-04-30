import { IPatient } from 'app/entities/patient/patient.model';
import { IChambre } from 'app/entities/chambre/chambre.model';
import { IClasse } from 'app/entities/classe/classe.model';

export interface IEtudiant {
  id: number;
  matricule?: string | null;
  patient?: Pick<IPatient, 'id' | 'motif'> | null;
  chambre?: Pick<IChambre, 'id' | 'chambreLibelle'> | null;
  classe?: Pick<IClasse, 'id'> | null;
}

export type NewEtudiant = Omit<IEtudiant, 'id'> & { id: null };
