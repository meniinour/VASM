import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportsExportsComponent } from './imports-exports.component';

describe('ImportsExportsComponent', () => {
  let component: ImportsExportsComponent;
  let fixture: ComponentFixture<ImportsExportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportsExportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportsExportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
