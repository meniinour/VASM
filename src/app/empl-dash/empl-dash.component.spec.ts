import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplDashComponent } from './empl-dash.component';

describe('EmplDashComponent', () => {
  let component: EmplDashComponent;
  let fixture: ComponentFixture<EmplDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
