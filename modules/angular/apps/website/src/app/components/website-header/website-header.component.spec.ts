import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteHeaderComponent } from './website-header.component';

describe('WebsiteHeaderComponent', () => {
  let component: WebsiteHeaderComponent;
  let fixture: ComponentFixture<WebsiteHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
