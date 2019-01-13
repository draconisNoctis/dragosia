import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import SEARCH_INDEX from '@dragosia/generic/search-index';
import * as lunr from 'lunr';
import { Index } from 'lunr';
import { SearchComponent } from './search/search.component';

require('lunr-languages/lunr.stemmer.support')(lunr);
require('lunr-languages/lunr.de')(lunr);


function lunrIndexFactory() {
    return Index.load(SEARCH_INDEX);
}

@NgModule({
    declarations   : [SearchComponent],
    imports        : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: SearchComponent },
            { path: '*', redirectTo: '/' }
        ]),
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
    ],
    providers      : [
        { provide: Index, useFactory: lunrIndexFactory }
    ]
})
export class SearchModule {
}
