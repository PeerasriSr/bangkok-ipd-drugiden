import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MduRequiredComponent } from './mdu-required.component';

describe('MduRequiredComponent', () => {
  let component: MduRequiredComponent;
  let fixture: ComponentFixture<MduRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MduRequiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MduRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
