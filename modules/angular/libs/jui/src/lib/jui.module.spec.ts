import { async, TestBed } from '@angular/core/testing';
import { JuiModule } from './jui.module';

describe('JuiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [JuiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(JuiModule).toBeDefined();
  });
});
