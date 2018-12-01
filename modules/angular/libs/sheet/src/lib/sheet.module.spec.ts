import { async, TestBed } from '@angular/core/testing';
import { SheetModule } from './sheet.module';

describe('SheetModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SheetModule]
        }).compileComponents();
    }));

    it('should create', () => {
        expect(SheetModule).toBeDefined();
    });
});
