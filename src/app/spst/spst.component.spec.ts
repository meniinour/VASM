import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpstComponent } from './spst.component';

describe('SpstComponent', () => {
  let component: SpstComponent;
  let fixture: ComponentFixture<SpstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
