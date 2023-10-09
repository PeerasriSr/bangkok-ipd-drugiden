import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugTimeComponent } from './drug-time.component';

describe('DrugTimeComponent', () => {
  let component: DrugTimeComponent;
  let fixture: ComponentFixture<DrugTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
