import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
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
        'class': 'js-add-dialog'
    }
})
export class AddDialogComponent implements OnInit {
    talents : IPartialTalent[];
    
    filter = new FormControl(null);
    
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
    }
}
