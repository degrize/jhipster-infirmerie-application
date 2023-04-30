import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConsultationFormService } from './consultation-form.service';
import { ConsultationService } from '../service/consultation.service';
import { IConsultation } from '../consultation.model';
import { IConstante } from 'app/entities/constante/constante.model';
import { ConstanteService } from 'app/entities/constante/service/constante.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IAgentSante } from 'app/entities/agent-sante/agent-sante.model';
import { AgentSanteService } from 'app/entities/agent-sante/service/agent-sante.service';
import { IOrdonnance } from 'app/entities/ordonnance/ordonnance.model';
import { OrdonnanceService } from 'app/entities/ordonnance/service/ordonnance.service';
import { ITypeConsultation } from 'app/entities/type-consultation/type-consultation.model';
import { TypeConsultationService } from 'app/entities/type-consultation/service/type-consultation.service';

import { ConsultationUpdateComponent } from './consultation-update.component';

describe('Consultation Management Update Component', () => {
  let comp: ConsultationUpdateComponent;
  let fixture: ComponentFixture<ConsultationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let consultationFormService: ConsultationFormService;
  let consultationService: ConsultationService;
  let constanteService: ConstanteService;
  let patientService: PatientService;
  let agentSanteService: AgentSanteService;
  let ordonnanceService: OrdonnanceService;
  let typeConsultationService: TypeConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConsultationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ConsultationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsultationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    consultationFormService = TestBed.inject(ConsultationFormService);
    consultationService = TestBed.inject(ConsultationService);
    constanteService = TestBed.inject(ConstanteService);
    patientService = TestBed.inject(PatientService);
    agentSanteService = TestBed.inject(AgentSanteService);
    ordonnanceService = TestBed.inject(OrdonnanceService);
    typeConsultationService = TestBed.inject(TypeConsultationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call constante query and add missing value', () => {
      const consultation: IConsultation = { id: 456 };
      const constante: IConstante = { id: 20205 };
      consultation.constante = constante;

      const constanteCollection: IConstante[] = [{ id: 97771 }];
      jest.spyOn(constanteService, 'query').mockReturnValue(of(new HttpResponse({ body: constanteCollection })));
      const expectedCollection: IConstante[] = [constante, ...constanteCollection];
      jest.spyOn(constanteService, 'addConstanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      expect(constanteService.query).toHaveBeenCalled();
      expect(constanteService.addConstanteToCollectionIfMissing).toHaveBeenCalledWith(constanteCollection, constante);
      expect(comp.constantesCollection).toEqual(expectedCollection);
    });

    it('Should call Patient query and add missing value', () => {
      const consultation: IConsultation = { id: 456 };
      const patient: IPatient = { id: 31374 };
      consultation.patient = patient;

      const patientCollection: IPatient[] = [{ id: 55499 }];
      jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
      const additionalPatients = [patient];
      const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
      jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      expect(patientService.query).toHaveBeenCalled();
      expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(
        patientCollection,
        ...additionalPatients.map(expect.objectContaining)
      );
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AgentSante query and add missing value', () => {
      const consultation: IConsultation = { id: 456 };
      const agentSante: IAgentSante = { id: 34003 };
      consultation.agentSante = agentSante;

      const agentSanteCollection: IAgentSante[] = [{ id: 34800 }];
      jest.spyOn(agentSanteService, 'query').mockReturnValue(of(new HttpResponse({ body: agentSanteCollection })));
      const additionalAgentSantes = [agentSante];
      const expectedCollection: IAgentSante[] = [...additionalAgentSantes, ...agentSanteCollection];
      jest.spyOn(agentSanteService, 'addAgentSanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      expect(agentSanteService.query).toHaveBeenCalled();
      expect(agentSanteService.addAgentSanteToCollectionIfMissing).toHaveBeenCalledWith(
        agentSanteCollection,
        ...additionalAgentSantes.map(expect.objectContaining)
      );
      expect(comp.agentSantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ordonnance query and add missing value', () => {
      const consultation: IConsultation = { id: 456 };
      const ordonnance: IOrdonnance = { id: 33309 };
      consultation.ordonnance = ordonnance;

      const ordonnanceCollection: IOrdonnance[] = [{ id: 38325 }];
      jest.spyOn(ordonnanceService, 'query').mockReturnValue(of(new HttpResponse({ body: ordonnanceCollection })));
      const additionalOrdonnances = [ordonnance];
      const expectedCollection: IOrdonnance[] = [...additionalOrdonnances, ...ordonnanceCollection];
      jest.spyOn(ordonnanceService, 'addOrdonnanceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      expect(ordonnanceService.query).toHaveBeenCalled();
      expect(ordonnanceService.addOrdonnanceToCollectionIfMissing).toHaveBeenCalledWith(
        ordonnanceCollection,
        ...additionalOrdonnances.map(expect.objectContaining)
      );
      expect(comp.ordonnancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TypeConsultation query and add missing value', () => {
      const consultation: IConsultation = { id: 456 };
      const typeConsultation: ITypeConsultation = { id: 76386 };
      consultation.typeConsultation = typeConsultation;

      const typeConsultationCollection: ITypeConsultation[] = [{ id: 94771 }];
      jest.spyOn(typeConsultationService, 'query').mockReturnValue(of(new HttpResponse({ body: typeConsultationCollection })));
      const additionalTypeConsultations = [typeConsultation];
      const expectedCollection: ITypeConsultation[] = [...additionalTypeConsultations, ...typeConsultationCollection];
      jest.spyOn(typeConsultationService, 'addTypeConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      expect(typeConsultationService.query).toHaveBeenCalled();
      expect(typeConsultationService.addTypeConsultationToCollectionIfMissing).toHaveBeenCalledWith(
        typeConsultationCollection,
        ...additionalTypeConsultations.map(expect.objectContaining)
      );
      expect(comp.typeConsultationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const consultation: IConsultation = { id: 456 };
      const constante: IConstante = { id: 85458 };
      consultation.constante = constante;
      const patient: IPatient = { id: 80783 };
      consultation.patient = patient;
      const agentSante: IAgentSante = { id: 81441 };
      consultation.agentSante = agentSante;
      const ordonnance: IOrdonnance = { id: 37030 };
      consultation.ordonnance = ordonnance;
      const typeConsultation: ITypeConsultation = { id: 44968 };
      consultation.typeConsultation = typeConsultation;

      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      expect(comp.constantesCollection).toContain(constante);
      expect(comp.patientsSharedCollection).toContain(patient);
      expect(comp.agentSantesSharedCollection).toContain(agentSante);
      expect(comp.ordonnancesSharedCollection).toContain(ordonnance);
      expect(comp.typeConsultationsSharedCollection).toContain(typeConsultation);
      expect(comp.consultation).toEqual(consultation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConsultation>>();
      const consultation = { id: 123 };
      jest.spyOn(consultationFormService, 'getConsultation').mockReturnValue(consultation);
      jest.spyOn(consultationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consultation }));
      saveSubject.complete();

      // THEN
      expect(consultationFormService.getConsultation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(consultationService.update).toHaveBeenCalledWith(expect.objectContaining(consultation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConsultation>>();
      const consultation = { id: 123 };
      jest.spyOn(consultationFormService, 'getConsultation').mockReturnValue({ id: null });
      jest.spyOn(consultationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consultation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consultation }));
      saveSubject.complete();

      // THEN
      expect(consultationFormService.getConsultation).toHaveBeenCalled();
      expect(consultationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConsultation>>();
      const consultation = { id: 123 };
      jest.spyOn(consultationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consultation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(consultationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareConstante', () => {
      it('Should forward to constanteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(constanteService, 'compareConstante');
        comp.compareConstante(entity, entity2);
        expect(constanteService.compareConstante).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePatient', () => {
      it('Should forward to patientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(patientService, 'comparePatient');
        comp.comparePatient(entity, entity2);
        expect(patientService.comparePatient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAgentSante', () => {
      it('Should forward to agentSanteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(agentSanteService, 'compareAgentSante');
        comp.compareAgentSante(entity, entity2);
        expect(agentSanteService.compareAgentSante).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOrdonnance', () => {
      it('Should forward to ordonnanceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ordonnanceService, 'compareOrdonnance');
        comp.compareOrdonnance(entity, entity2);
        expect(ordonnanceService.compareOrdonnance).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTypeConsultation', () => {
      it('Should forward to typeConsultationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(typeConsultationService, 'compareTypeConsultation');
        comp.compareTypeConsultation(entity, entity2);
        expect(typeConsultationService.compareTypeConsultation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
