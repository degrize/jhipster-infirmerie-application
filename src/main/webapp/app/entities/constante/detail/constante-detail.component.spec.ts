import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConstanteDetailComponent } from './constante-detail.component';

describe('Constante Management Detail Component', () => {
  let comp: ConstanteDetailComponent;
  let fixture: ComponentFixture<ConstanteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstanteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ constante: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConstanteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConstanteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load constante on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.constante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
