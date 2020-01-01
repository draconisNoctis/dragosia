import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatCommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { PresetsModule } from '@jina-draicana/presets';
import { SheetModule } from '@jina-draicana/sheet';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ComponentsModule } from '../../components/components.module';
import { SheetEffects } from './+state/sheet.effects';
import { sheetReducer } from './+state/sheet.reducer';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { PrintComponent } from './print/print.component';
import { SheetComponent } from './sheet/sheet.component';
import { BackgroundComponent } from './wizard-dialog/steps/background/background.component';
import { SelectionComponent } from './wizard-dialog/steps/selection/selection.component';
import { SettingsComponent } from './wizard-dialog/steps/settings/settings.component';
import { WizardDialogComponent } from './wizard-dialog/wizard-dialog.component';


@NgModule({
    declarations   : [ SheetComponent, WizardDialogComponent, SettingsComponent, BackgroundComponent, SelectionComponent, PrintComponent, ConfirmDeleteDialogComponent ],
    imports        : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: SheetComponent },
            { path: 'print/:id', component: PrintComponent },
            { path: ':id', component: SheetComponent },
            { path: '*', redirectTo: '/' }
        ]),
        SheetModule,
        PresetsModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatCommonModule,
        MatSidenavModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatRadioModule,
        MatIconModule,
        MatTabsModule,
        MatTooltipModule,
        MatCheckboxModule,
        StoreModule.forFeature('sheet', sheetReducer),
        EffectsModule.forFeature([ SheetEffects ]),
        ComponentsModule
    ],
    providers      : [],
    entryComponents: [ WizardDialogComponent, ConfirmDeleteDialogComponent ],
})
export class DcmModule {
}
