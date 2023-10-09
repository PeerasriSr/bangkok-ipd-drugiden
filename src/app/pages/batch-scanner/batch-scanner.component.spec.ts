import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchScannerComponent } from './batch-scanner.component';

describe('BatchScannerComponent', () => {
  let component: BatchScannerComponent;
  let fixture: ComponentFixture<BatchScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchScannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
