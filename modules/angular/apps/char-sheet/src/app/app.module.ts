import { MatButtonModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SheetModule } from '@jina-draicana/sheet';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [AppComponent, SheetComponent],
    imports: [
        BrowserModule,
        NxModule.forRoot(),
        RouterModule.forRoot([
            { path: '', component: SheetComponent },
            { path: '*', redirectTo: '/' }
        ], { initialNavigation: 'enabled' }),
        SheetModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
