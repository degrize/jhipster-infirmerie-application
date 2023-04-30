import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AntecedentDetailComponent } from './antecedent-detail.component';

describe('Antecedent Management Detail Component', () => {
  let comp: AntecedentDetailComponent;
  let fixture: ComponentFixture<AntecedentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AntecedentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ antecedent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AntecedentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AntecedentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load antecedent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.antecedent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
