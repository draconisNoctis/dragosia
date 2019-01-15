import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IPartialGift } from '@jina-draicana/presets';

@Component({
    selector       : 'js-add-dialog',
    templateUrl    : './add-dialog.component.html',
    styleUrls      : [ './add-dialog.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'js-add-dialog mat-typography'
    }
})
export class AddDialogComponent implements OnInit {
    customGiftControl = new FormControl(null, Validators.required);
    
    gifts : IPartialGift[];
    
    constructor(@Inject(MAT_DIALOG_DATA) data : { gifts: IPartialGift[] }) {
        this.gifts = data.gifts;
    }
    
    ngOnInit() {
    }
    
}
