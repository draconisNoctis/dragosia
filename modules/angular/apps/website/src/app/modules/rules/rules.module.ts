import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
        FormsModule,
        ReactiveFormsModule,
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
