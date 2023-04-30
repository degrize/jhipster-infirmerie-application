import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EcoleFormService } from './ecole-form.service';
import { EcoleService } from '../service/ecole.service';
import { IEcole } from '../ecole.model';

import { EcoleUpdateComponent } from './ecole-update.component';

describe('Ecole Management Update Component', () => {
  let comp: EcoleUpdateComponent;
  let fixture: ComponentFixture<EcoleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ecoleFormService: EcoleFormService;
  let ecoleService: EcoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EcoleUpdateComponent],
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
      .overrideTemplate(EcoleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EcoleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ecoleFormService = TestBed.inject(EcoleFormService);
    ecoleService = TestBed.inject(EcoleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ecole: IEcole = { id: 456 };

      activatedRoute.data = of({ ecole });
      comp.ngOnInit();

      expect(comp.ecole).toEqual(ecole);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEcole>>();
      const ecole = { id: 123 };
      jest.spyOn(ecoleFormService, 'getEcole').mockReturnValue(ecole);
      jest.spyOn(ecoleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ecole });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ecole }));
      saveSubject.complete();

      // THEN
      expect(ecoleFormService.getEcole).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ecoleService.update).toHaveBeenCalledWith(expect.objectContaining(ecole));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEcole>>();
      const ecole = { id: 123 };
      jest.spyOn(ecoleFormService, 'getEcole').mockReturnValue({ id: null });
      jest.spyOn(ecoleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ecole: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ecole }));
      saveSubject.complete();

      // THEN
      expect(ecoleFormService.getEcole).toHaveBeenCalled();
      expect(ecoleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEcole>>();
      const ecole = { id: 123 };
      jest.spyOn(ecoleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ecole });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ecoleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
