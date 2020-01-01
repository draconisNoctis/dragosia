import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../../components/components.module';
import { ProbabilityComponent } from './probability/probability.component';
import { RaiseComponent } from './raise/raise.component';


@NgModule({
    declarations: [ProbabilityComponent, RaiseComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'wahrscheinlichkeiten', component: ProbabilityComponent },
            { path: 'steigerungstabelle', component: RaiseComponent }
        ]),
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatSelectModule,
        ComponentsModule
    ]
})
export class UtilsModule {
}
