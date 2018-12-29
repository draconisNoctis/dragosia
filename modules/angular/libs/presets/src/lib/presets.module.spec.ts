import { async, TestBed } from '@angular/core/testing';
import { PresetsModule } from './presets.module';

describe('PresetsModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PresetsModule]
        }).compileComponents();
    }));

    it('should create', () => {
        expect(PresetsModule).toBeDefined();
    });
});
