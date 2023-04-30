import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeAgentDetailComponent } from './type-agent-detail.component';

describe('TypeAgent Management Detail Component', () => {
  let comp: TypeAgentDetailComponent;
  let fixture: ComponentFixture<TypeAgentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeAgentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeAgent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeAgentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeAgentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeAgent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeAgent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
