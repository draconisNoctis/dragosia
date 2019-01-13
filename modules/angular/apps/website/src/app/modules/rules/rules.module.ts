import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { PageComponent } from './page/page.component';


@NgModule({
    declarations   : [PageComponent],
    imports        : [
        CommonModule,
        RouterModule.forChild([
            { path: ':page', component: PageComponent },
            { path: '', component: PageComponent },
            { path: '*', redirectTo: '/' }
        ]),
        MarkdownModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
    ],
    providers      : []
})
export class RulesModule {
}
