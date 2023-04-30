import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MiseEnObservationDetailComponent } from './mise-en-observation-detail.component';

describe('MiseEnObservation Management Detail Component', () => {
  let comp: MiseEnObservationDetailComponent;
  let fixture: ComponentFixture<MiseEnObservationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiseEnObservationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ miseEnObservation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MiseEnObservationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MiseEnObservationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load miseEnObservation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.miseEnObservation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
