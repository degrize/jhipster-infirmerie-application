import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EcoleDetailComponent } from './ecole-detail.component';

describe('Ecole Management Detail Component', () => {
  let comp: EcoleDetailComponent;
  let fixture: ComponentFixture<EcoleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcoleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ecole: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EcoleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EcoleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ecole on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ecole).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
