import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule
} from '@angular/material';
import { WebsiteHeaderComponent } from './website-header/website-header.component';
import { WebsiteFooterComponent } from './website-footer/website-footer.component';

@NgModule({
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
    ],
    declarations: [ WebsiteHeaderComponent, WebsiteFooterComponent ],
    exports     : [ WebsiteHeaderComponent, WebsiteFooterComponent ]
})
export class ComponentsModule {
}
