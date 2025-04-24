import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContentComponent } from './my-content.component';

describe('MyContentComponent', () => {
  let component: MyContentComponent;
  let fixture: ComponentFixture<MyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
