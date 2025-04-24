import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebloquerMailComponent } from './debloquer-mail.component';

describe('DebloquerMailComponent', () => {
  let component: DebloquerMailComponent;
  let fixture: ComponentFixture<DebloquerMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebloquerMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebloquerMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
