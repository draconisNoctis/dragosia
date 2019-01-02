import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { JuiModule } from '@jina-draicana/jui';
import { AttributesComponent } from './attributes/attributes.component';
import { AddDialogComponent } from './gifts/add-dialog/add-dialog.component';
import { GiftsComponent } from './gifts/gifts.component';
import { SheetComponent } from './sheet/sheet.component';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
    imports        : [ CommonModule, JuiModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule ],
    declarations   : [ SheetComponent, AttributesComponent, SkillsComponent, GiftsComponent, AddDialogComponent ],
    entryComponents: [ AddDialogComponent ],
    exports        : [ SheetComponent, AttributesComponent, SkillsComponent, GiftsComponent, AddDialogComponent ]
})
export class SheetModule {
}
