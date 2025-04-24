import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibererMailComponent } from './liberer-mail.component';

describe('LibererMailComponent', () => {
  let component: LibererMailComponent;
  let fixture: ComponentFixture<LibererMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibererMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibererMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
