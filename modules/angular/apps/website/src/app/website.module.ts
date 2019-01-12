import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { NxModule } from '@nrwl/nx';
import { WebsiteState } from './+state/website.state';
import { HomeComponent } from './pages/home/home.component';

import { WebsiteComponent } from './website.component';

@NgModule({
    declarations: [WebsiteComponent, HomeComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatDividerModule,
        MatListModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NxModule.forRoot(),
        StoreModule.forRoot({
        
        } as ActionReducerMap<WebsiteState>),
        EffectsModule.forRoot([]),
        RouterModule.forRoot([
            { path: '', component: HomeComponent }
        ], { initialNavigation: 'enabled', useHash: true })
    ],
    providers: [],
    bootstrap: [WebsiteComponent]
})
export class WebsiteModule {}
