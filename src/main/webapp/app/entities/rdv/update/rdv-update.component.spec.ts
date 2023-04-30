import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RdvFormService } from './rdv-form.service';
import { RdvService } from '../service/rdv.service';
import { IRdv } from '../rdv.model';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

import { RdvUpdateComponent } from './rdv-update.component';

describe('Rdv Management Update Component', () => {
  let comp: RdvUpdateComponent;
  let fixture: ComponentFixture<RdvUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rdvFormService: RdvFormService;
  let rdvService: RdvService;
  let consultationService: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RdvUpdateComponent],
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
      .overrideTemplate(RdvUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RdvUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rdvFormService = TestBed.inject(RdvFormService);
    rdvService = TestBed.inject(RdvService);
    consultationService = TestBed.inject(ConsultationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call consultation query and add missing value', () => {
      const rdv: IRdv = { id: 456 };
      const consultation: IConsultation = { id: 62918 };
      rdv.consultation = consultation;

      const consultationCollection: IConsultation[] = [{ id: 79361 }];
      jest.spyOn(consultationService, 'query').mockReturnValue(of(new HttpResponse({ body: consultationCollection })));
      const expectedCollection: IConsultation[] = [consultation, ...consultationCollection];
      jest.spyOn(consultationService, 'addConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rdv });
      comp.ngOnInit();

      expect(consultationService.query).toHaveBeenCalled();
      expect(consultationService.addConsultationToCollectionIfMissing).toHaveBeenCalledWith(consultationCollection, consultation);
      expect(comp.consultationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const rdv: IRdv = { id: 456 };
      const consultation: IConsultation = { id: 90455 };
      rdv.consultation = consultation;

      activatedRoute.data = of({ rdv });
      comp.ngOnInit();

      expect(comp.consultationsCollection).toContain(consultation);
      expect(comp.rdv).toEqual(rdv);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRdv>>();
      const rdv = { id: 123 };
      jest.spyOn(rdvFormService, 'getRdv').mockReturnValue(rdv);
      jest.spyOn(rdvService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rdv });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rdv }));
      saveSubject.complete();

      // THEN
      expect(rdvFormService.getRdv).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rdvService.update).toHaveBeenCalledWith(expect.objectContaining(rdv));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRdv>>();
      const rdv = { id: 123 };
      jest.spyOn(rdvFormService, 'getRdv').mockReturnValue({ id: null });
      jest.spyOn(rdvService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rdv: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rdv }));
      saveSubject.complete();

      // THEN
      expect(rdvFormService.getRdv).toHaveBeenCalled();
      expect(rdvService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRdv>>();
      const rdv = { id: 123 };
      jest.spyOn(rdvService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rdv });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rdvService.update).toHaveBeenCalled();
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
