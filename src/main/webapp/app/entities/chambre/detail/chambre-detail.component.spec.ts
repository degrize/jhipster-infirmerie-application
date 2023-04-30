import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChambreDetailComponent } from './chambre-detail.component';

describe('Chambre Management Detail Component', () => {
  let comp: ChambreDetailComponent;
  let fixture: ComponentFixture<ChambreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChambreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chambre: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChambreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChambreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chambre on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chambre).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
