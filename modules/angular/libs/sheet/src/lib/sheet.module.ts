import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatSelectModule, MatTooltipModule
} from '@angular/material';
import { JuiModule } from '@jina-draicana/jui';
import { AttributesComponent } from './attributes/attributes.component';
import { AddDialogComponent as AddGiftDialogComponent } from './gifts/add-dialog/add-dialog.component';
import { AddDialogComponent as AddTalentDialogComponent } from './talents/add-dialog/add-dialog.component';
import { GiftsComponent } from './gifts/gifts.component';
import { SheetComponent } from './sheet/sheet.component';
import { SkillsComponent } from './skills/skills.component';
import { TalentsComponent } from './talents/talents.component';

@NgModule({
    imports        : [ CommonModule, JuiModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule,
        MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule, MatSelectModule, MatTooltipModule ],
    declarations   : [ SheetComponent, AttributesComponent, SkillsComponent, GiftsComponent, AddGiftDialogComponent, TalentsComponent, AddTalentDialogComponent ],
    entryComponents: [ AddGiftDialogComponent, AddTalentDialogComponent ],
    exports        : [ SheetComponent, AttributesComponent, SkillsComponent, GiftsComponent, AddGiftDialogComponent, TalentsComponent, AddTalentDialogComponent ]
})
export class SheetModule {
}
