import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtudiantFormService } from './etudiant-form.service';
import { EtudiantService } from '../service/etudiant.service';
import { IEtudiant } from '../etudiant.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IChambre } from 'app/entities/chambre/chambre.model';
import { ChambreService } from 'app/entities/chambre/service/chambre.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';

import { EtudiantUpdateComponent } from './etudiant-update.component';

describe('Etudiant Management Update Component', () => {
  let comp: EtudiantUpdateComponent;
  let fixture: ComponentFixture<EtudiantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etudiantFormService: EtudiantFormService;
  let etudiantService: EtudiantService;
  let patientService: PatientService;
  let chambreService: ChambreService;
  let classeService: ClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtudiantUpdateComponent],
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
      .overrideTemplate(EtudiantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtudiantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etudiantFormService = TestBed.inject(EtudiantFormService);
    etudiantService = TestBed.inject(EtudiantService);
    patientService = TestBed.inject(PatientService);
    chambreService = TestBed.inject(ChambreService);
    classeService = TestBed.inject(ClasseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call patient query and add missing value', () => {
      const etudiant: IEtudiant = { id: 456 };
      const patient: IPatient = { id: 47670 };
      etudiant.patient = patient;

      const patientCollection: IPatient[] = [{ id: 72850 }];
      jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
      const expectedCollection: IPatient[] = [patient, ...patientCollection];
      jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(patientService.query).toHaveBeenCalled();
      expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, patient);
      expect(comp.patientsCollection).toEqual(expectedCollection);
    });

    it('Should call chambre query and add missing value', () => {
      const etudiant: IEtudiant = { id: 456 };
      const chambre: IChambre = { id: 30319 };
      etudiant.chambre = chambre;

      const chambreCollection: IChambre[] = [{ id: 82498 }];
      jest.spyOn(chambreService, 'query').mockReturnValue(of(new HttpResponse({ body: chambreCollection })));
      const expectedCollection: IChambre[] = [chambre, ...chambreCollection];
      jest.spyOn(chambreService, 'addChambreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(chambreService.query).toHaveBeenCalled();
      expect(chambreService.addChambreToCollectionIfMissing).toHaveBeenCalledWith(chambreCollection, chambre);
      expect(comp.chambresCollection).toEqual(expectedCollection);
    });

    it('Should call Classe query and add missing value', () => {
      const etudiant: IEtudiant = { id: 456 };
      const classe: IClasse = { id: 45987 };
      etudiant.classe = classe;

      const classeCollection: IClasse[] = [{ id: 82813 }];
      jest.spyOn(classeService, 'query').mockReturnValue(of(new HttpResponse({ body: classeCollection })));
      const additionalClasses = [classe];
      const expectedCollection: IClasse[] = [...additionalClasses, ...classeCollection];
      jest.spyOn(classeService, 'addClasseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(classeService.query).toHaveBeenCalled();
      expect(classeService.addClasseToCollectionIfMissing).toHaveBeenCalledWith(
        classeCollection,
        ...additionalClasses.map(expect.objectContaining)
      );
      expect(comp.classesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etudiant: IEtudiant = { id: 456 };
      const patient: IPatient = { id: 93438 };
      etudiant.patient = patient;
      const chambre: IChambre = { id: 16840 };
      etudiant.chambre = chambre;
      const classe: IClasse = { id: 93300 };
      etudiant.classe = classe;

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(comp.patientsCollection).toContain(patient);
      expect(comp.chambresCollection).toContain(chambre);
      expect(comp.classesSharedCollection).toContain(classe);
      expect(comp.etudiant).toEqual(etudiant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantFormService, 'getEtudiant').mockReturnValue(etudiant);
      jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etudiant }));
      saveSubject.complete();

      // THEN
      expect(etudiantFormService.getEtudiant).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(etudiantService.update).toHaveBeenCalledWith(expect.objectContaining(etudiant));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantFormService, 'getEtudiant').mockReturnValue({ id: null });
      jest.spyOn(etudiantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etudiant }));
      saveSubject.complete();

      // THEN
      expect(etudiantFormService.getEtudiant).toHaveBeenCalled();
      expect(etudiantService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etudiantService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePatient', () => {
      it('Should forward to patientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(patientService, 'comparePatient');
        comp.comparePatient(entity, entity2);
        expect(patientService.comparePatient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareChambre', () => {
      it('Should forward to chambreService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(chambreService, 'compareChambre');
        comp.compareChambre(entity, entity2);
        expect(chambreService.compareChambre).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClasse', () => {
      it('Should forward to classeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(classeService, 'compareClasse');
        comp.compareClasse(entity, entity2);
        expect(classeService.compareClasse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
