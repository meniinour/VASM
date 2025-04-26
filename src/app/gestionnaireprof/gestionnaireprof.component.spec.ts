import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireprofComponent } from './gestionnaireprof.component';

describe('GestionnaireprofComponent', () => {
  let component: GestionnaireprofComponent;
  let fixture: ComponentFixture<GestionnaireprofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionnaireprofComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionnaireprofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
