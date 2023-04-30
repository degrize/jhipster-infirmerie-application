import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MiseEnObservationFormService } from './mise-en-observation-form.service';
import { MiseEnObservationService } from '../service/mise-en-observation.service';
import { IMiseEnObservation } from '../mise-en-observation.model';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

import { MiseEnObservationUpdateComponent } from './mise-en-observation-update.component';

describe('MiseEnObservation Management Update Component', () => {
  let comp: MiseEnObservationUpdateComponent;
  let fixture: ComponentFixture<MiseEnObservationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let miseEnObservationFormService: MiseEnObservationFormService;
  let miseEnObservationService: MiseEnObservationService;
  let consultationService: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MiseEnObservationUpdateComponent],
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
      .overrideTemplate(MiseEnObservationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MiseEnObservationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    miseEnObservationFormService = TestBed.inject(MiseEnObservationFormService);
    miseEnObservationService = TestBed.inject(MiseEnObservationService);
    consultationService = TestBed.inject(ConsultationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Consultation query and add missing value', () => {
      const miseEnObservation: IMiseEnObservation = { id: 456 };
      const miseEnObservation: IConsultation = { id: 75482 };
      miseEnObservation.miseEnObservation = miseEnObservation;

      const consultationCollection: IConsultation[] = [{ id: 97818 }];
      jest.spyOn(consultationService, 'query').mockReturnValue(of(new HttpResponse({ body: consultationCollection })));
      const additionalConsultations = [miseEnObservation];
      const expectedCollection: IConsultation[] = [...additionalConsultations, ...consultationCollection];
      jest.spyOn(consultationService, 'addConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ miseEnObservation });
      comp.ngOnInit();

      expect(consultationService.query).toHaveBeenCalled();
      expect(consultationService.addConsultationToCollectionIfMissing).toHaveBeenCalledWith(
        consultationCollection,
        ...additionalConsultations.map(expect.objectContaining)
      );
      expect(comp.consultationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const miseEnObservation: IMiseEnObservation = { id: 456 };
      const miseEnObservation: IConsultation = { id: 78974 };
      miseEnObservation.miseEnObservation = miseEnObservation;

      activatedRoute.data = of({ miseEnObservation });
      comp.ngOnInit();

      expect(comp.consultationsSharedCollection).toContain(miseEnObservation);
      expect(comp.miseEnObservation).toEqual(miseEnObservation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiseEnObservation>>();
      const miseEnObservation = { id: 123 };
      jest.spyOn(miseEnObservationFormService, 'getMiseEnObservation').mockReturnValue(miseEnObservation);
      jest.spyOn(miseEnObservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miseEnObservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: miseEnObservation }));
      saveSubject.complete();

      // THEN
      expect(miseEnObservationFormService.getMiseEnObservation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(miseEnObservationService.update).toHaveBeenCalledWith(expect.objectContaining(miseEnObservation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiseEnObservation>>();
      const miseEnObservation = { id: 123 };
      jest.spyOn(miseEnObservationFormService, 'getMiseEnObservation').mockReturnValue({ id: null });
      jest.spyOn(miseEnObservationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miseEnObservation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: miseEnObservation }));
      saveSubject.complete();

      // THEN
      expect(miseEnObservationFormService.getMiseEnObservation).toHaveBeenCalled();
      expect(miseEnObservationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiseEnObservation>>();
      const miseEnObservation = { id: 123 };
      jest.spyOn(miseEnObservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miseEnObservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(miseEnObservationService.update).toHaveBeenCalled();
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
