import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangepickerheaderComponent } from './rangepickerheader.component';

describe('RangepickerheaderComponent', () => {
  let component: RangepickerheaderComponent;
  let fixture: ComponentFixture<RangepickerheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangepickerheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangepickerheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
