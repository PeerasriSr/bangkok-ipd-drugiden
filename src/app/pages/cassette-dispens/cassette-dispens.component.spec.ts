import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CassetteDispensComponent } from './cassette-dispens.component';

describe('CassetteDispensComponent', () => {
  let component: CassetteDispensComponent;
  let fixture: ComponentFixture<CassetteDispensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CassetteDispensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CassetteDispensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
