import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeMedicamentFormService } from './type-medicament-form.service';
import { TypeMedicamentService } from '../service/type-medicament.service';
import { ITypeMedicament } from '../type-medicament.model';

import { TypeMedicamentUpdateComponent } from './type-medicament-update.component';

describe('TypeMedicament Management Update Component', () => {
  let comp: TypeMedicamentUpdateComponent;
  let fixture: ComponentFixture<TypeMedicamentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeMedicamentFormService: TypeMedicamentFormService;
  let typeMedicamentService: TypeMedicamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeMedicamentUpdateComponent],
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
      .overrideTemplate(TypeMedicamentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeMedicamentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeMedicamentFormService = TestBed.inject(TypeMedicamentFormService);
    typeMedicamentService = TestBed.inject(TypeMedicamentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeMedicament: ITypeMedicament = { id: 456 };

      activatedRoute.data = of({ typeMedicament });
      comp.ngOnInit();

      expect(comp.typeMedicament).toEqual(typeMedicament);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeMedicament>>();
      const typeMedicament = { id: 123 };
      jest.spyOn(typeMedicamentFormService, 'getTypeMedicament').mockReturnValue(typeMedicament);
      jest.spyOn(typeMedicamentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeMedicament });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeMedicament }));
      saveSubject.complete();

      // THEN
      expect(typeMedicamentFormService.getTypeMedicament).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeMedicamentService.update).toHaveBeenCalledWith(expect.objectContaining(typeMedicament));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeMedicament>>();
      const typeMedicament = { id: 123 };
      jest.spyOn(typeMedicamentFormService, 'getTypeMedicament').mockReturnValue({ id: null });
      jest.spyOn(typeMedicamentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeMedicament: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeMedicament }));
      saveSubject.complete();

      // THEN
      expect(typeMedicamentFormService.getTypeMedicament).toHaveBeenCalled();
      expect(typeMedicamentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeMedicament>>();
      const typeMedicament = { id: 123 };
      jest.spyOn(typeMedicamentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeMedicament });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeMedicamentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
