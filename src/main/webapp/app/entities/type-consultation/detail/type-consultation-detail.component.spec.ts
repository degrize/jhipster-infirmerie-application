import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeConsultationDetailComponent } from './type-consultation-detail.component';

describe('TypeConsultation Management Detail Component', () => {
  let comp: TypeConsultationDetailComponent;
  let fixture: ComponentFixture<TypeConsultationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeConsultationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeConsultation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeConsultationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeConsultationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeConsultation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeConsultation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
