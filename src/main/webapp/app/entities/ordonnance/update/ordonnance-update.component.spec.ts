import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrdonnanceFormService } from './ordonnance-form.service';
import { OrdonnanceService } from '../service/ordonnance.service';
import { IOrdonnance } from '../ordonnance.model';

import { OrdonnanceUpdateComponent } from './ordonnance-update.component';

describe('Ordonnance Management Update Component', () => {
  let comp: OrdonnanceUpdateComponent;
  let fixture: ComponentFixture<OrdonnanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ordonnanceFormService: OrdonnanceFormService;
  let ordonnanceService: OrdonnanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrdonnanceUpdateComponent],
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
      .overrideTemplate(OrdonnanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrdonnanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ordonnanceFormService = TestBed.inject(OrdonnanceFormService);
    ordonnanceService = TestBed.inject(OrdonnanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ordonnance: IOrdonnance = { id: 456 };

      activatedRoute.data = of({ ordonnance });
      comp.ngOnInit();

      expect(comp.ordonnance).toEqual(ordonnance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrdonnance>>();
      const ordonnance = { id: 123 };
      jest.spyOn(ordonnanceFormService, 'getOrdonnance').mockReturnValue(ordonnance);
      jest.spyOn(ordonnanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordonnance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ordonnance }));
      saveSubject.complete();

      // THEN
      expect(ordonnanceFormService.getOrdonnance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ordonnanceService.update).toHaveBeenCalledWith(expect.objectContaining(ordonnance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrdonnance>>();
      const ordonnance = { id: 123 };
      jest.spyOn(ordonnanceFormService, 'getOrdonnance').mockReturnValue({ id: null });
      jest.spyOn(ordonnanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordonnance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ordonnance }));
      saveSubject.complete();

      // THEN
      expect(ordonnanceFormService.getOrdonnance).toHaveBeenCalled();
      expect(ordonnanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrdonnance>>();
      const ordonnance = { id: 123 };
      jest.spyOn(ordonnanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordonnance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ordonnanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
