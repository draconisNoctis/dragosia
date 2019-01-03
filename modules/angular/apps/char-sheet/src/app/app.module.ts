import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCommonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatListModule,
    MatMenuModule, MatRadioModule, MatSelectModule,
    MatSidenavModule, MatStepperModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { SheetModule } from '@jina-draicana/sheet';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { SheetEffects } from './+state/sheet.effects';
import { sheetReducer } from './+state/sheet.reducer';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { localStorageSync } from 'ngrx-store-localstorage';
import { WizardDialogComponent } from './wizard-dialog/wizard-dialog.component';
import { SettingsComponent } from './wizard-dialog/steps/settings/settings.component'
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BackgroundComponent } from './wizard-dialog/steps/background/background.component';
import { SelectionComponent } from './wizard-dialog/steps/selection/selection.component';

const _syncReducer = localStorageSync({
    keys: [ 'sheet' ],
    rehydrate: true
});

export function syncReducer(reducer : ActionReducer<any>) : ActionReducer<any> {
    return _syncReducer(reducer);
}

export function translationsFactory(locale : string) {
    return locale ? require(`raw-loader!../../../../locale/${locale}.xtb`) : '';
}

@NgModule({
    declarations: [AppComponent, SheetComponent, WizardDialogComponent, SettingsComponent, BackgroundComponent, SelectionComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NxModule.forRoot(),
        RouterModule.forRoot([
            { path: '', component: SheetComponent },
            { path: ':id', component: SheetComponent },
            { path: '*', redirectTo: '/' }
        ], { initialNavigation: 'enabled', useHash: true }),
        SheetModule,
        BrowserAnimationsModule,
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
        StoreModule.forRoot({
            sheet: sheetReducer
        }, {
            metaReducers: [
                syncReducer
            ]
        }),
        EffectsModule.forRoot([ SheetEffects ])
    ],
    providers: [
        I18n,
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
        {
            provide: TRANSLATIONS,
            useFactory: translationsFactory,
            deps: [LOCALE_ID]
        },
    ],
    entryComponents: [WizardDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
