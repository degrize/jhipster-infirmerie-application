import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CentreSanteFormService } from './centre-sante-form.service';
import { CentreSanteService } from '../service/centre-sante.service';
import { ICentreSante } from '../centre-sante.model';

import { CentreSanteUpdateComponent } from './centre-sante-update.component';

describe('CentreSante Management Update Component', () => {
  let comp: CentreSanteUpdateComponent;
  let fixture: ComponentFixture<CentreSanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let centreSanteFormService: CentreSanteFormService;
  let centreSanteService: CentreSanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CentreSanteUpdateComponent],
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
      .overrideTemplate(CentreSanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CentreSanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    centreSanteFormService = TestBed.inject(CentreSanteFormService);
    centreSanteService = TestBed.inject(CentreSanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const centreSante: ICentreSante = { id: 456 };

      activatedRoute.data = of({ centreSante });
      comp.ngOnInit();

      expect(comp.centreSante).toEqual(centreSante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICentreSante>>();
      const centreSante = { id: 123 };
      jest.spyOn(centreSanteFormService, 'getCentreSante').mockReturnValue(centreSante);
      jest.spyOn(centreSanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ centreSante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: centreSante }));
      saveSubject.complete();

      // THEN
      expect(centreSanteFormService.getCentreSante).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(centreSanteService.update).toHaveBeenCalledWith(expect.objectContaining(centreSante));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICentreSante>>();
      const centreSante = { id: 123 };
      jest.spyOn(centreSanteFormService, 'getCentreSante').mockReturnValue({ id: null });
      jest.spyOn(centreSanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ centreSante: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: centreSante }));
      saveSubject.complete();

      // THEN
      expect(centreSanteFormService.getCentreSante).toHaveBeenCalled();
      expect(centreSanteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICentreSante>>();
      const centreSante = { id: 123 };
      jest.spyOn(centreSanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ centreSante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(centreSanteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
