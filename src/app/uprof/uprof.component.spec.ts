import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UprofComponent } from './uprof.component';

describe('UprofComponent', () => {
  let component: UprofComponent;
  let fixture: ComponentFixture<UprofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UprofComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UprofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
