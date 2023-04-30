import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrdonnanceDetailComponent } from './ordonnance-detail.component';

describe('Ordonnance Management Detail Component', () => {
  let comp: OrdonnanceDetailComponent;
  let fixture: ComponentFixture<OrdonnanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdonnanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ordonnance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrdonnanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrdonnanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ordonnance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ordonnance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
