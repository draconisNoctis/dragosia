import { HttpClientModule } from '@angular/common/http';
import { isDevMode, LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule, MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatTabsModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NxModule } from '@nrwl/nx';
import { localStorageSync } from 'ngrx-store-localstorage';
import { environment } from '../environments/environment';
import { WebsiteState } from './+state/website.state';
import { ComponentsModule } from './components/components.module';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

import { WebsiteComponent } from './website.component';
import { LoginComponent } from './pages/login/login.component';

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
    declarations: [ WebsiteComponent, HomeComponent, LoginComponent ],
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
        MatTabsModule,
        MatCardModule,
        NxModule.forRoot(),
        StoreModule.forRoot({} as ActionReducerMap<WebsiteState>, {
            metaReducers: [ syncReducer ]
        }),
        StoreDevtoolsModule.instrument(),
        EffectsModule.forRoot([]),
        RouterModule.forRoot([
            { path: 'dcm', loadChildren: './modules/dcm/dcm.module#DcmModule' },
            { path: 'search', loadChildren: './modules/search/search.module#SearchModule' },
            { path: 'utils', loadChildren: './modules/utils/utils.module#UtilsModule' },
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent, canActivate: [ AuthGuard ] },
            { path: '', loadChildren: './modules/presets/presets.module#PresetsModule' },
            { path: '', loadChildren: './modules/mdp/mdp.module#MdpModule' },
            { path: '**', redirectTo: '/' }
        ], { initialNavigation: 'enabled' }),
        ComponentsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule
    ],
    providers   : [
        I18n,
        { provide: TRANSLATIONS_FORMAT, useValue: 'xtb' },
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
