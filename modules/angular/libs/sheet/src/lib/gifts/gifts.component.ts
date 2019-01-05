import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { COSTS, getCosts, IGift, IPartialGift, Presets } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { pairwise, throttleTime } from 'rxjs/operators';
import { AbstractComponent } from '../abstract.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';

@Component({
    selector       : 'js-gifts',
    templateUrl    : './gifts.component.html',
    styleUrls      : [ './gifts.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: [ 'pointsAvailable', 'mode', 'factor' ],
    outputs: [ 'pointsAvailableChange' ],
    host           : {
        'class'                  : 'js-gifts mat-typography',
        '[class.js-gifts-button]': 'mode === "button"',
        '[class.js-gifts-range]' : 'mode === "range"'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: GiftsComponent,
        multi      : true
    } ]
})
export class GiftsComponent extends AbstractComponent implements ControlValueAccessor {
    @Input()
    set preset(preset : string) {
        this.gifts = this.presets.getGiftsForPreset(preset);
    }
    
    gifts? : IPartialGift[];
    
    form = new FormArray([]);
    
    mins : number[] = [];
    
    
    constructor(protected readonly dialog : MatDialog,
                protected readonly presets : Presets,
                protected readonly cdr : ChangeDetectorRef) {
        super();
    }
    
    writeValue(obj : any[]) : void {
        this.unregisterSubscriptions();
        while(this.form.length) {
            this.form.removeAt(0);
        }
        if(obj) {
            this.mins = obj.map(o => o.value);
            for(const gift of obj) {
                if(gift.name) {
                    this.addGift(gift);
                }
            }
        }
        this.registerSubscription();
    }
    
    protected addGift(gift : IGift) {
        this.form.push(new FormGroup({
            name : new FormControl(gift.name, Validators.required),
            value: new FormControl(gift.value || 0, Validators.required),
        }))
    }
    
    async openAddDialog() {
        const v : IGift[] = this.form.value;
        const ref = this.dialog.open(AddDialogComponent, {
            data: {
                gifts: this.gifts.filter(gift => {
                    return !v.some(g => g.name === gift.name);
                })
            }
        });
        
        const result = await ref.afterClosed().toPromise();
        
        if(result) {
            this.addGift(result);
            this.mins.push(0);
            this.pointsAvailable -= this.factor;
            this.cdr.markForCheck();
        }
    }
    
    
    add(index : number) {
        const control = this.form.at(index)!.get('value')!;
        control.setValue(control.value + 1);
    }
    
    protected calculatePrice(previous : any, current : any) : number {
        let price = 0;
        for(const key in current) {
            price += getCosts(previous[ key ] ? previous[ key ].value : -1, current[ key ].value);
        }
        
        return price;
    }
    
}
