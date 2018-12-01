import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component';

@NgModule({
    declarations: [AppComponent, SheetComponent],
    imports: [
        BrowserModule,
        NxModule.forRoot(),
        RouterModule.forRoot([
            { path: '', component: SheetComponent },
            { path: '*', redirectTo: '/' }
        ], { initialNavigation: 'enabled' })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
