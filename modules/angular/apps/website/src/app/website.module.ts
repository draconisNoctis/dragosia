import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isDevMode, LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NxModule } from '@nrwl/nx';
import { localStorageSync } from 'ngrx-store-localstorage';
import { WebsiteState } from './+state/website.state';
import { ComponentsModule } from './components/components.module';
import { HomeComponent } from './pages/home/home.component';

import { WebsiteComponent } from './website.component';

const _syncReducer = localStorageSync({
    keys     : [ 'sheet' ],
    rehydrate: true
});

export function syncReducer(reducer : ActionReducer<any>) : ActionReducer<any> {
    return _syncReducer(reducer);
}


export function translationsFactory(locale : string) {
    try {
        return locale ? require(`raw-loader!../../../../locale/${locale}.xtb`) : '';
    } catch(e) {
        if(!isDevMode()) {
            console.warn('Cannot load translations for locale', locale);
            console.warn(e);
        }
        
        return '';
    }
}

@NgModule({
    declarations: [ WebsiteComponent, HomeComponent ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatDividerModule,
        MatListModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NxModule.forRoot(),
        StoreModule.forRoot({} as ActionReducerMap<WebsiteState>, {
            metaReducers: [ syncReducer ]
        }),
        StoreDevtoolsModule.instrument(),
        EffectsModule.forRoot([]),
        RouterModule.forRoot([
            { path: 'dcm', loadChildren: './modules/dcm/dcm.module#DcmModule' },
            { path: 'r', loadChildren: './modules/rules/rules.module#RulesModule' },
            { path: 'search', loadChildren: './modules/search/search.module#SearchModule' },
            { path: '', component: HomeComponent },
            { path: '*', redirectTo: '/' }
        ], { initialNavigation: 'enabled' }),
        ComponentsModule
    ],
    providers   : [
        I18n,
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
        {
            provide   : TRANSLATIONS,
            useFactory: translationsFactory,
            deps      : [ LOCALE_ID ]
        }
    ],
    bootstrap   : [ WebsiteComponent ]
})
export class WebsiteModule {
}
