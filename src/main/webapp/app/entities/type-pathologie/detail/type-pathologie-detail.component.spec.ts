import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypePathologieDetailComponent } from './type-pathologie-detail.component';

describe('TypePathologie Management Detail Component', () => {
  let comp: TypePathologieDetailComponent;
  let fixture: ComponentFixture<TypePathologieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypePathologieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typePathologie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypePathologieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypePathologieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typePathologie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typePathologie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
