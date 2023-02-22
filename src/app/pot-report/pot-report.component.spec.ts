import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotReportComponent } from './pot-report.component';

describe('PotReportComponent', () => {
  let component: PotReportComponent;
  let fixture: ComponentFixture<PotReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
