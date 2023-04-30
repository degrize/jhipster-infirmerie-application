import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AgentSanteDetailComponent } from './agent-sante-detail.component';

describe('AgentSante Management Detail Component', () => {
  let comp: AgentSanteDetailComponent;
  let fixture: ComponentFixture<AgentSanteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentSanteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ agentSante: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AgentSanteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AgentSanteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load agentSante on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.agentSante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
