import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugPatientComponent } from './drug-patient.component';

describe('DrugPatientComponent', () => {
  let component: DrugPatientComponent;
  let fixture: ComponentFixture<DrugPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
