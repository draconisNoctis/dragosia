import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioRangeComponent } from './radio-range.component';

describe('RadioRangeComponent', () => {
  let component: RadioRangeComponent;
  let fixture: ComponentFixture<RadioRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
