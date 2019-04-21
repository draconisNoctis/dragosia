import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IPartialGift } from '@jina-draicana/presets';
import { RaiseService, Level } from '../../raise/raise.service';

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
    customGiftGroup = new FormGroup({
        name: new FormControl(null, Validators.required),
        level: new FormControl('F', [ Validators.required, ({ value }) => {
            if(null != value && this.getActivationCost(value) > this.budget) {
                return { overbudget: { budget: this.budget } }
            }
            return null;
        }])
    });

    budget: number;
    gifts : IPartialGift[];

    constructor(@Inject(MAT_DIALOG_DATA) data : { gifts: IPartialGift[], budget: number },
                protected readonly raiseService : RaiseService) {
        this.budget = data.budget;
        this.gifts = data.gifts;
    }

    ngOnInit() {
    }

    getActivationCost(level : Level) {
        return this.raiseService.getActivationCost(level);
    }
}
