import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExamenFormService } from './examen-form.service';
import { ExamenService } from '../service/examen.service';
import { IExamen } from '../examen.model';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

import { ExamenUpdateComponent } from './examen-update.component';

describe('Examen Management Update Component', () => {
  let comp: ExamenUpdateComponent;
  let fixture: ComponentFixture<ExamenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let examenFormService: ExamenFormService;
  let examenService: ExamenService;
  let consultationService: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExamenUpdateComponent],
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
      .overrideTemplate(ExamenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    examenFormService = TestBed.inject(ExamenFormService);
    examenService = TestBed.inject(ExamenService);
    consultationService = TestBed.inject(ConsultationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Consultation query and add missing value', () => {
      const examen: IExamen = { id: 456 };
      const consultation: IConsultation = { id: 66244 };
      examen.consultation = consultation;

      const consultationCollection: IConsultation[] = [{ id: 39534 }];
      jest.spyOn(consultationService, 'query').mockReturnValue(of(new HttpResponse({ body: consultationCollection })));
      const additionalConsultations = [consultation];
      const expectedCollection: IConsultation[] = [...additionalConsultations, ...consultationCollection];
      jest.spyOn(consultationService, 'addConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      expect(consultationService.query).toHaveBeenCalled();
      expect(consultationService.addConsultationToCollectionIfMissing).toHaveBeenCalledWith(
        consultationCollection,
        ...additionalConsultations.map(expect.objectContaining)
      );
      expect(comp.consultationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const examen: IExamen = { id: 456 };
      const consultation: IConsultation = { id: 28934 };
      examen.consultation = consultation;

      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      expect(comp.consultationsSharedCollection).toContain(consultation);
      expect(comp.examen).toEqual(examen);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExamen>>();
      const examen = { id: 123 };
      jest.spyOn(examenFormService, 'getExamen').mockReturnValue(examen);
      jest.spyOn(examenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examen }));
      saveSubject.complete();

      // THEN
      expect(examenFormService.getExamen).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(examenService.update).toHaveBeenCalledWith(expect.objectContaining(examen));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExamen>>();
      const examen = { id: 123 };
      jest.spyOn(examenFormService, 'getExamen').mockReturnValue({ id: null });
      jest.spyOn(examenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examen: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examen }));
      saveSubject.complete();

      // THEN
      expect(examenFormService.getExamen).toHaveBeenCalled();
      expect(examenService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExamen>>();
      const examen = { id: 123 };
      jest.spyOn(examenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(examenService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareConsultation', () => {
      it('Should forward to consultationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(consultationService, 'compareConsultation');
        comp.compareConsultation(entity, entity2);
        expect(consultationService.compareConsultation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
