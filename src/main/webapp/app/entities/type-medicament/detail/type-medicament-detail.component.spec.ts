import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeMedicamentDetailComponent } from './type-medicament-detail.component';

describe('TypeMedicament Management Detail Component', () => {
  let comp: TypeMedicamentDetailComponent;
  let fixture: ComponentFixture<TypeMedicamentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeMedicamentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeMedicament: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeMedicamentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeMedicamentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeMedicament on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeMedicament).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
