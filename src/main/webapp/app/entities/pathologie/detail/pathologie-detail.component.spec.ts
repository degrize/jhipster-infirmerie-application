import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PathologieDetailComponent } from './pathologie-detail.component';

describe('Pathologie Management Detail Component', () => {
  let comp: PathologieDetailComponent;
  let fixture: ComponentFixture<PathologieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathologieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pathologie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PathologieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PathologieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pathologie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pathologie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
