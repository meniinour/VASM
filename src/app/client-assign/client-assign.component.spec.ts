import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignComponent } from './client-assign.component';

describe('ClientAssignComponent', () => {
  let component: ClientAssignComponent;
  let fixture: ComponentFixture<ClientAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
