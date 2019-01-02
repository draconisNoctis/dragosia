import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IPartialGift } from '@jina-draicana/presets';

@Component({
    selector       : 'js-add-dialog',
    templateUrl    : './add-dialog.component.html',
    styleUrls      : [ './add-dialog.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'js-add-dialog'
    }
})
export class AddDialogComponent implements OnInit {
    gifts : IPartialGift[];
    
    constructor(@Inject(MAT_DIALOG_DATA) data : { gifts: IPartialGift[] }) {
        this.gifts = data.gifts;
    }
    
    ngOnInit() {
    }
    
}
