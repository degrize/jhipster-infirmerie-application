import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConstanteFormService } from './constante-form.service';
import { ConstanteService } from '../service/constante.service';
import { IConstante } from '../constante.model';

import { ConstanteUpdateComponent } from './constante-update.component';

describe('Constante Management Update Component', () => {
  let comp: ConstanteUpdateComponent;
  let fixture: ComponentFixture<ConstanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let constanteFormService: ConstanteFormService;
  let constanteService: ConstanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConstanteUpdateComponent],
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
      .overrideTemplate(ConstanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConstanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    constanteFormService = TestBed.inject(ConstanteFormService);
    constanteService = TestBed.inject(ConstanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const constante: IConstante = { id: 456 };

      activatedRoute.data = of({ constante });
      comp.ngOnInit();

      expect(comp.constante).toEqual(constante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConstante>>();
      const constante = { id: 123 };
      jest.spyOn(constanteFormService, 'getConstante').mockReturnValue(constante);
      jest.spyOn(constanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ constante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: constante }));
      saveSubject.complete();

      // THEN
      expect(constanteFormService.getConstante).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(constanteService.update).toHaveBeenCalledWith(expect.objectContaining(constante));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConstante>>();
      const constante = { id: 123 };
      jest.spyOn(constanteFormService, 'getConstante').mockReturnValue({ id: null });
      jest.spyOn(constanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ constante: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: constante }));
      saveSubject.complete();

      // THEN
      expect(constanteFormService.getConstante).toHaveBeenCalled();
      expect(constanteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConstante>>();
      const constante = { id: 123 };
      jest.spyOn(constanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ constante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(constanteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
