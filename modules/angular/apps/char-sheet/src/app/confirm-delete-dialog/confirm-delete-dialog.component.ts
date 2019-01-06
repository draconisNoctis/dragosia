import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ICharacter } from '@jina-draicana/presets';

@Component({
    selector       : 'cs-confirm-delete-dialog',
    templateUrl    : './confirm-delete-dialog.component.html',
    styleUrls      : [ './confirm-delete-dialog.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'cs-confirm-delete-dialog'
    }
})
export class ConfirmDeleteDialogComponent {
    char : ICharacter;
    
    constructor(@Inject(MAT_DIALOG_DATA) data : { character: ICharacter }) {
        this.char = data.character;
    }
}
