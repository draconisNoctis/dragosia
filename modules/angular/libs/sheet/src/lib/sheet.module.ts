import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
} from '@angular/material';
import { JuiModule } from '@jina-draicana/jui';
import { PresetsModule } from '@jina-draicana/presets';

import { AdvantagesToStringPipe } from './advantages-to-string.pipe';
import { AdvantagesComponent } from './advantages/advantages.component';
import { ArmorComponent } from './armor/armor.component';
import { AttributesComponent } from './attributes/attributes.component';
import { GeneralComponent } from './general/general.component';
import { AddDialogComponent as AddGiftDialogComponent } from './gifts/add-dialog/add-dialog.component';
import { GiftsComponent } from './gifts/gifts.component';
import { SheetComponent } from './sheet/sheet.component';
import { SkillsComponent } from './skills/skills.component';
import { AddDialogComponent as AddTalentDialogComponent } from './talents/add-dialog/add-dialog.component';
import { TalentsComponent } from './talents/talents.component';

@NgModule({
    imports: [CommonModule, JuiModule, PresetsModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule,
        MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule, MatSelectModule, MatTooltipModule, MatTableModule, MatTabsModule],
    declarations: [SheetComponent, AttributesComponent, SkillsComponent, GiftsComponent, AddGiftDialogComponent, TalentsComponent, AddTalentDialogComponent, GeneralComponent, AdvantagesComponent, AdvantagesToStringPipe, ArmorComponent],
    entryComponents: [AddGiftDialogComponent, AddTalentDialogComponent],
    exports: [SheetComponent, AttributesComponent, SkillsComponent, GiftsComponent, AddGiftDialogComponent, TalentsComponent, AddTalentDialogComponent, GeneralComponent, AdvantagesComponent, AdvantagesToStringPipe, ArmorComponent]
})
export class SheetModule {
}
