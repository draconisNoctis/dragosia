import {
    MatButtonModule,
    MatCommonModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { localStorageSync } from 'ngrx-store-localstorage'

const _syncReducer = localStorageSync({
    keys: [ 'sheet' ],
    rehydrate: true
});

export function syncReducer(reducer : ActionReducer<any>) : ActionReducer<any> {
    return _syncReducer(reducer);
}


@NgModule({
    declarations: [AppComponent, SheetComponent],
    imports: [
        BrowserModule,
        NxModule.forRoot(),
        RouterModule.forRoot([
            { path: '', component: SheetComponent },
            { path: ':id', component: SheetComponent },
            { path: '*', redirectTo: '/' }
        ], { initialNavigation: 'enabled' }),
        SheetModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatCommonModule,
        MatSidenavModule,
        StoreModule.forRoot({
            sheet: sheetReducer
        }, {
            metaReducers: [
                syncReducer
            ]
        }),
        EffectsModule.forRoot([ SheetEffects ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
