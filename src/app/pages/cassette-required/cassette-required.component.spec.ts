import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CassetteRequiredComponent } from './cassette-required.component';

describe('CassetteRequiredComponent', () => {
  let component: CassetteRequiredComponent;
  let fixture: ComponentFixture<CassetteRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CassetteRequiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CassetteRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
