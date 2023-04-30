import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RdvDetailComponent } from './rdv-detail.component';

describe('Rdv Management Detail Component', () => {
  let comp: RdvDetailComponent;
  let fixture: ComponentFixture<RdvDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RdvDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ rdv: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RdvDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RdvDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load rdv on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.rdv).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
