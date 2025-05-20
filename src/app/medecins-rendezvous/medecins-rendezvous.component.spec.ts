import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinsRendezvousComponent } from './medecins-rendezvous.component';

describe('MedecinsRendezvousComponent', () => {
  let component: MedecinsRendezvousComponent;
  let fixture: ComponentFixture<MedecinsRendezvousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinsRendezvousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinsRendezvousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
