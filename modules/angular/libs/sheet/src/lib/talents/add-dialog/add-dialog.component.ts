import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IPartialTalent } from '@jina-draicana/presets';
import { map, startWith } from 'rxjs/operators';

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
    talents : IPartialTalent[];
    
    filter = new FormControl(null);
    
    customTalentControl = new FormGroup({
        name: new FormControl(null, Validators.required),
        category: new FormControl(null, Validators.required),
        attribute: new FormControl(null, Validators.required),
        skill: new FormControl(null, Validators.required)
    });
    
    filteredTalents = this.filter.valueChanges.pipe(
        startWith(''),
        map(value => {
            return value ? this.talents.filter(t => t.category === value) : this.talents;
        })
    );
    
    constructor(@Inject(MAT_DIALOG_DATA) data : { talents: IPartialTalent[] }) {
        this.talents = data.talents;
    }
    
    ngOnInit() {
        const map = {
            melee: 'N',
            range: 'F',
            physical: 'K',
            mental: 'G',
            gifts: ''
        };
        this.customTalentControl.get('category')!.valueChanges.subscribe(value => {
            this.customTalentControl.get('skill')!.setValue(map[value], { emitEvent: false });
        })
    }
}
