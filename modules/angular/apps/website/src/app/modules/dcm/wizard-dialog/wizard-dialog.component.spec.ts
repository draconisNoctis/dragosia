import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardDialogComponent } from './wizard-dialog.component';

describe('WizardDialogComponent', () => {
    let component: WizardDialogComponent;
    let fixture: ComponentFixture<WizardDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WizardDialogComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WizardDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
