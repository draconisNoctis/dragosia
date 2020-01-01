import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbabilityComponent } from './raise.component';

describe('ProbabilityComponent', () => {
  let component: ProbabilityComponent;
  let fixture: ComponentFixture<ProbabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProbabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
