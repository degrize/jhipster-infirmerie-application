import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypePathologieFormService } from './type-pathologie-form.service';
import { TypePathologieService } from '../service/type-pathologie.service';
import { ITypePathologie } from '../type-pathologie.model';

import { TypePathologieUpdateComponent } from './type-pathologie-update.component';

describe('TypePathologie Management Update Component', () => {
  let comp: TypePathologieUpdateComponent;
  let fixture: ComponentFixture<TypePathologieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typePathologieFormService: TypePathologieFormService;
  let typePathologieService: TypePathologieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypePathologieUpdateComponent],
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
      .overrideTemplate(TypePathologieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypePathologieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typePathologieFormService = TestBed.inject(TypePathologieFormService);
    typePathologieService = TestBed.inject(TypePathologieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typePathologie: ITypePathologie = { id: 456 };

      activatedRoute.data = of({ typePathologie });
      comp.ngOnInit();

      expect(comp.typePathologie).toEqual(typePathologie);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypePathologie>>();
      const typePathologie = { id: 123 };
      jest.spyOn(typePathologieFormService, 'getTypePathologie').mockReturnValue(typePathologie);
      jest.spyOn(typePathologieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePathologie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typePathologie }));
      saveSubject.complete();

      // THEN
      expect(typePathologieFormService.getTypePathologie).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(typePathologieService.update).toHaveBeenCalledWith(expect.objectContaining(typePathologie));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypePathologie>>();
      const typePathologie = { id: 123 };
      jest.spyOn(typePathologieFormService, 'getTypePathologie').mockReturnValue({ id: null });
      jest.spyOn(typePathologieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePathologie: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typePathologie }));
      saveSubject.complete();

      // THEN
      expect(typePathologieFormService.getTypePathologie).toHaveBeenCalled();
      expect(typePathologieService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypePathologie>>();
      const typePathologie = { id: 123 };
      jest.spyOn(typePathologieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePathologie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typePathologieService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
