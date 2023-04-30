import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClasseFormService } from './classe-form.service';
import { ClasseService } from '../service/classe.service';
import { IClasse } from '../classe.model';

import { ClasseUpdateComponent } from './classe-update.component';

describe('Classe Management Update Component', () => {
  let comp: ClasseUpdateComponent;
  let fixture: ComponentFixture<ClasseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let classeFormService: ClasseFormService;
  let classeService: ClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClasseUpdateComponent],
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
      .overrideTemplate(ClasseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClasseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    classeFormService = TestBed.inject(ClasseFormService);
    classeService = TestBed.inject(ClasseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const classe: IClasse = { id: 456 };

      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      expect(comp.classe).toEqual(classe);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeFormService, 'getClasse').mockReturnValue(classe);
      jest.spyOn(classeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classe }));
      saveSubject.complete();

      // THEN
      expect(classeFormService.getClasse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(classeService.update).toHaveBeenCalledWith(expect.objectContaining(classe));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeFormService, 'getClasse').mockReturnValue({ id: null });
      jest.spyOn(classeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classe }));
      saveSubject.complete();

      // THEN
      expect(classeFormService.getClasse).toHaveBeenCalled();
      expect(classeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(classeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
