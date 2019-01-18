import { CommonModule } from '@angular/common';
import { isDevMode, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { JuiMarkdownModule } from '@jina-draicana/jui';
import { ComponentsModule } from '../../components/components.module';
import { AdvantagesDisadvantagesComponent } from './advantages-disadvantages/advantages-disadvantages.component';



// export function translationsFactory(locale : string) {
//     try {
//         return locale ? require(`raw-loader!../../../../../../locale/${locale}.xtb`) : '';
//     } catch(e) {
//         if(!isDevMode()) {
//             console.warn('Cannot load translations for locale', locale);
//             console.warn(e);
//         }
//
//         return '';
//     }
// }

@NgModule({
    declarations: [ AdvantagesDisadvantagesComponent ],
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'vorteile', component: AdvantagesDisadvantagesComponent, data: { mode: 'ADVANTAGES' } },
            { path: 'nachteile', component: AdvantagesDisadvantagesComponent, data: { mode: 'DISADVANTAGES' } }
        ]),
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatSelectModule,
        MatSortModule,
        MatPaginatorModule,
        ComponentsModule,
        JuiMarkdownModule.forRoot()
    ]
})
export class PresetsModule {
}
