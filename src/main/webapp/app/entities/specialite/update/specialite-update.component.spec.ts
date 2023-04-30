import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SpecialiteFormService } from './specialite-form.service';
import { SpecialiteService } from '../service/specialite.service';
import { ISpecialite } from '../specialite.model';

import { SpecialiteUpdateComponent } from './specialite-update.component';

describe('Specialite Management Update Component', () => {
  let comp: SpecialiteUpdateComponent;
  let fixture: ComponentFixture<SpecialiteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let specialiteFormService: SpecialiteFormService;
  let specialiteService: SpecialiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SpecialiteUpdateComponent],
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
      .overrideTemplate(SpecialiteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpecialiteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    specialiteFormService = TestBed.inject(SpecialiteFormService);
    specialiteService = TestBed.inject(SpecialiteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const specialite: ISpecialite = { id: 456 };

      activatedRoute.data = of({ specialite });
      comp.ngOnInit();

      expect(comp.specialite).toEqual(specialite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpecialite>>();
      const specialite = { id: 123 };
      jest.spyOn(specialiteFormService, 'getSpecialite').mockReturnValue(specialite);
      jest.spyOn(specialiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: specialite }));
      saveSubject.complete();

      // THEN
      expect(specialiteFormService.getSpecialite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(specialiteService.update).toHaveBeenCalledWith(expect.objectContaining(specialite));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpecialite>>();
      const specialite = { id: 123 };
      jest.spyOn(specialiteFormService, 'getSpecialite').mockReturnValue({ id: null });
      jest.spyOn(specialiteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialite: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: specialite }));
      saveSubject.complete();

      // THEN
      expect(specialiteFormService.getSpecialite).toHaveBeenCalled();
      expect(specialiteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpecialite>>();
      const specialite = { id: 123 };
      jest.spyOn(specialiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(specialiteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
