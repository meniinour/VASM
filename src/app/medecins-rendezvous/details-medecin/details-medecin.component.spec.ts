import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMedecinComponent } from './details-medecin.component';

describe('DetailsMedecinComponent', () => {
  let component: DetailsMedecinComponent;
  let fixture: ComponentFixture<DetailsMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
