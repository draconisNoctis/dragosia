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
import { ComponentsModule } from '../../components/components.module';
import { SearchComponent } from './search/search.component';
import { LUNR_INDEX } from './tokens';

import * as lunrStemmerSupport from 'lunr-languages/lunr.stemmer.support';
import * as lunrDe from 'lunr-languages/lunr.de';

lunrStemmerSupport(lunr);
lunrDe(lunr);


export function lunrIndexFactory() {
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
        MatCardModule,
        ComponentsModule
    ],
    providers      : [
        { provide: LUNR_INDEX, useFactory: lunrIndexFactory }
    ]
})
export class SearchModule {
}
