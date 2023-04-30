import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AntecedentFormService } from './antecedent-form.service';
import { AntecedentService } from '../service/antecedent.service';
import { IAntecedent } from '../antecedent.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

import { AntecedentUpdateComponent } from './antecedent-update.component';

describe('Antecedent Management Update Component', () => {
  let comp: AntecedentUpdateComponent;
  let fixture: ComponentFixture<AntecedentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let antecedentFormService: AntecedentFormService;
  let antecedentService: AntecedentService;
  let patientService: PatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AntecedentUpdateComponent],
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
      .overrideTemplate(AntecedentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AntecedentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    antecedentFormService = TestBed.inject(AntecedentFormService);
    antecedentService = TestBed.inject(AntecedentService);
    patientService = TestBed.inject(PatientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Patient query and add missing value', () => {
      const antecedent: IAntecedent = { id: 456 };
      const patient: IPatient = { id: 88738 };
      antecedent.patient = patient;

      const patientCollection: IPatient[] = [{ id: 76980 }];
      jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
      const additionalPatients = [patient];
      const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
      jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ antecedent });
      comp.ngOnInit();

      expect(patientService.query).toHaveBeenCalled();
      expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(
        patientCollection,
        ...additionalPatients.map(expect.objectContaining)
      );
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const antecedent: IAntecedent = { id: 456 };
      const patient: IPatient = { id: 92425 };
      antecedent.patient = patient;

      activatedRoute.data = of({ antecedent });
      comp.ngOnInit();

      expect(comp.patientsSharedCollection).toContain(patient);
      expect(comp.antecedent).toEqual(antecedent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntecedent>>();
      const antecedent = { id: 123 };
      jest.spyOn(antecedentFormService, 'getAntecedent').mockReturnValue(antecedent);
      jest.spyOn(antecedentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antecedent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antecedent }));
      saveSubject.complete();

      // THEN
      expect(antecedentFormService.getAntecedent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(antecedentService.update).toHaveBeenCalledWith(expect.objectContaining(antecedent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntecedent>>();
      const antecedent = { id: 123 };
      jest.spyOn(antecedentFormService, 'getAntecedent').mockReturnValue({ id: null });
      jest.spyOn(antecedentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antecedent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antecedent }));
      saveSubject.complete();

      // THEN
      expect(antecedentFormService.getAntecedent).toHaveBeenCalled();
      expect(antecedentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntecedent>>();
      const antecedent = { id: 123 };
      jest.spyOn(antecedentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antecedent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(antecedentService.update).toHaveBeenCalled();
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
  });
});
