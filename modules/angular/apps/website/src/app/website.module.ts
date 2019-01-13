import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isDevMode, LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
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
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { WebsiteState } from './+state/website.state';
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

const RULE_PAGE_REGEXP = /^\.\/([\w\/]+)\.md/i;

// Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
// /c*$/ is vulnerable to REDOS.
// invert: Remove suffix of non-c chars instead. Default falsey.
function rtrim(str, c, invert) {
    if (str.length === 0) {
        return '';
    }
    
    // Length of suffix matching the invert condition.
    var suffLen = 0;
    
    // Step left until we fail to match the invert condition.
    while (suffLen < str.length) {
        var currChar = str.charAt(str.length - suffLen - 1);
        if (currChar === c && !invert) {
            suffLen++;
        } else if (currChar !== c && invert) {
            suffLen++;
        } else {
            break;
        }
    }
    
    return str.substr(0, str.length - suffLen);
}
function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (/^[^:]+:\/*[^/]*$/.test(base)) {
            baseUrls[' ' + base] = base + '/';
        } else {
            baseUrls[' ' + base] = rtrim(base, '/', true);
        }
    }
    base = baseUrls[' ' + base];
    
    if (href.slice(0, 2) === '//') {
        return base.replace(/:[\s\S]*/, ':') + href;
    } else if (href.charAt(0) === '/') {
        return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
    } else {
        return base + href;
    }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function cleanUrl(sanitize, base, href) {
    if (sanitize) {
        try {
            var prot = decodeURIComponent(unescape(href))
                .replace(/[^\w:]/g, '')
                .toLowerCase();
        } catch (e) {
            return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
            return null;
        }
    }
    if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
    }
    try {
        href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
        return null;
    }
    return href;
}

export function markedOptionsFactory(router : Router, location : LocationStrategy): MarkedOptions {
    const renderer = new MarkedRenderer();
    
    const link = renderer.link;
    renderer.link = function(href : string, title: string, text: string) {
        if(RULE_PAGE_REGEXP.test(href)) {
            const [ _, page ] = RULE_PAGE_REGEXP.exec(href)!;
            const route = [ '/r', page ];
            href = location.prepareExternalUrl(router.createUrlTree(route).toString());
            href = cleanUrl((renderer as any).options.sanitize, (renderer as any).options.baseUrl, href);
            const t = title ? ` title="${title}"` : '';
            return `<a href="${escape(href)}"${t} data-route-href="${escape(JSON.stringify(route))}">${text}</a>`
        }
        
        return link.call(this, href, title, text);
    };
    
    return {
        renderer: renderer
    };
}

@NgModule({
    declarations: [ WebsiteComponent, HomeComponent ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
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
            { path: '', component: HomeComponent },
            { path: '*', redirectTo: '/' }
        ], { initialNavigation: 'enabled' }),
        MarkdownModule.forRoot({
            loader: HttpClient,
            markedOptions: {
                provide: MarkedOptions,
                useFactory: markedOptionsFactory,
                deps: [ Router, LocationStrategy ]
            }
        })
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
