import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CentreSanteDetailComponent } from './centre-sante-detail.component';

describe('CentreSante Management Detail Component', () => {
  let comp: CentreSanteDetailComponent;
  let fixture: ComponentFixture<CentreSanteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CentreSanteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ centreSante: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CentreSanteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CentreSanteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load centreSante on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.centreSante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
