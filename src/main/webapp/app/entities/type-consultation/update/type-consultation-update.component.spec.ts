import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeConsultationFormService } from './type-consultation-form.service';
import { TypeConsultationService } from '../service/type-consultation.service';
import { ITypeConsultation } from '../type-consultation.model';

import { TypeConsultationUpdateComponent } from './type-consultation-update.component';

describe('TypeConsultation Management Update Component', () => {
  let comp: TypeConsultationUpdateComponent;
  let fixture: ComponentFixture<TypeConsultationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeConsultationFormService: TypeConsultationFormService;
  let typeConsultationService: TypeConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeConsultationUpdateComponent],
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
      .overrideTemplate(TypeConsultationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeConsultationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeConsultationFormService = TestBed.inject(TypeConsultationFormService);
    typeConsultationService = TestBed.inject(TypeConsultationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeConsultation: ITypeConsultation = { id: 456 };

      activatedRoute.data = of({ typeConsultation });
      comp.ngOnInit();

      expect(comp.typeConsultation).toEqual(typeConsultation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeConsultation>>();
      const typeConsultation = { id: 123 };
      jest.spyOn(typeConsultationFormService, 'getTypeConsultation').mockReturnValue(typeConsultation);
      jest.spyOn(typeConsultationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeConsultation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeConsultation }));
      saveSubject.complete();

      // THEN
      expect(typeConsultationFormService.getTypeConsultation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeConsultationService.update).toHaveBeenCalledWith(expect.objectContaining(typeConsultation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeConsultation>>();
      const typeConsultation = { id: 123 };
      jest.spyOn(typeConsultationFormService, 'getTypeConsultation').mockReturnValue({ id: null });
      jest.spyOn(typeConsultationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeConsultation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeConsultation }));
      saveSubject.complete();

      // THEN
      expect(typeConsultationFormService.getTypeConsultation).toHaveBeenCalled();
      expect(typeConsultationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeConsultation>>();
      const typeConsultation = { id: 123 };
      jest.spyOn(typeConsultationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeConsultation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeConsultationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
