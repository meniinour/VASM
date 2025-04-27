import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashmangComponent } from './dashmang.component';

describe('DashmangComponent', () => {
  let component: DashmangComponent;
  let fixture: ComponentFixture<DashmangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashmangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashmangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
