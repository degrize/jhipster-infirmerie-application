import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PersonnelFormService } from './personnel-form.service';
import { PersonnelService } from '../service/personnel.service';
import { IPersonnel } from '../personnel.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

import { PersonnelUpdateComponent } from './personnel-update.component';

describe('Personnel Management Update Component', () => {
  let comp: PersonnelUpdateComponent;
  let fixture: ComponentFixture<PersonnelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let personnelFormService: PersonnelFormService;
  let personnelService: PersonnelService;
  let patientService: PatientService;
  let serviceService: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PersonnelUpdateComponent],
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
      .overrideTemplate(PersonnelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonnelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    personnelFormService = TestBed.inject(PersonnelFormService);
    personnelService = TestBed.inject(PersonnelService);
    patientService = TestBed.inject(PatientService);
    serviceService = TestBed.inject(ServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call patient query and add missing value', () => {
      const personnel: IPersonnel = { id: 456 };
      const patient: IPatient = { id: 92892 };
      personnel.patient = patient;

      const patientCollection: IPatient[] = [{ id: 27628 }];
      jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
      const expectedCollection: IPatient[] = [patient, ...patientCollection];
      jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ personnel });
      comp.ngOnInit();

      expect(patientService.query).toHaveBeenCalled();
      expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, patient);
      expect(comp.patientsCollection).toEqual(expectedCollection);
    });

    it('Should call Service query and add missing value', () => {
      const personnel: IPersonnel = { id: 456 };
      const service: IService = { id: 31836 };
      personnel.service = service;

      const serviceCollection: IService[] = [{ id: 13788 }];
      jest.spyOn(serviceService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCollection })));
      const additionalServices = [service];
      const expectedCollection: IService[] = [...additionalServices, ...serviceCollection];
      jest.spyOn(serviceService, 'addServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ personnel });
      comp.ngOnInit();

      expect(serviceService.query).toHaveBeenCalled();
      expect(serviceService.addServiceToCollectionIfMissing).toHaveBeenCalledWith(
        serviceCollection,
        ...additionalServices.map(expect.objectContaining)
      );
      expect(comp.servicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const personnel: IPersonnel = { id: 456 };
      const patient: IPatient = { id: 43758 };
      personnel.patient = patient;
      const service: IService = { id: 32647 };
      personnel.service = service;

      activatedRoute.data = of({ personnel });
      comp.ngOnInit();

      expect(comp.patientsCollection).toContain(patient);
      expect(comp.servicesSharedCollection).toContain(service);
      expect(comp.personnel).toEqual(personnel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonnel>>();
      const personnel = { id: 123 };
      jest.spyOn(personnelFormService, 'getPersonnel').mockReturnValue(personnel);
      jest.spyOn(personnelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personnel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personnel }));
      saveSubject.complete();

      // THEN
      expect(personnelFormService.getPersonnel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(personnelService.update).toHaveBeenCalledWith(expect.objectContaining(personnel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonnel>>();
      const personnel = { id: 123 };
      jest.spyOn(personnelFormService, 'getPersonnel').mockReturnValue({ id: null });
      jest.spyOn(personnelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personnel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personnel }));
      saveSubject.complete();

      // THEN
      expect(personnelFormService.getPersonnel).toHaveBeenCalled();
      expect(personnelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonnel>>();
      const personnel = { id: 123 };
      jest.spyOn(personnelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personnel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(personnelService.update).toHaveBeenCalled();
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

    describe('compareService', () => {
      it('Should forward to serviceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(serviceService, 'compareService');
        comp.compareService(entity, entity2);
        expect(serviceService.compareService).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
