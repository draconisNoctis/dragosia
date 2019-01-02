import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { getCosts, IGift, IPartialGift, Presets } from '@jina-draicana/presets';
import { combineLatest, Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { AddDialogComponent } from './add-dialog/add-dialog.component';

@Component({
    selector       : 'js-gifts',
    templateUrl    : './gifts.component.html',
    styleUrls      : [ './gifts.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'js-gifts mat-typography'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: GiftsComponent,
        multi      : true
    } ]
})
export class GiftsComponent implements OnInit, ControlValueAccessor {
    @Input()
    set preset(preset : string) {
        this.gifts = this.presets.getGiftsForPreset(preset);
    }
    
    @Input()
    set pointsAvailable(value : number) {
        this._pointsAvailable = value;
        this.pointsAvailableChange.emit(value);
    }
    get pointsAvailable() : number {
        return this._pointsAvailable;
    }
    protected _pointsAvailable?: number;
    
    @Input()
    factor = 1;
    
    @Output()
    pointsAvailableChange = new EventEmitter<number>();
    
    gifts?: IPartialGift[];
    
    form = new FormArray([]);
    
    mins : number[] = [];
    
    subscription = Subscription.EMPTY;
    
    constructor(protected readonly dialog : MatDialog,
                protected readonly presets : Presets,
                protected readonly cdr : ChangeDetectorRef) {
    }
    
    ngOnInit() {
        this.form.valueChanges.pipe(
            startWith(null),
            pairwise()
        ).subscribe(([ previous, current ]) => {
            if(null === previous) {
                return;
            }
        
            let price = 0;
            for(const key in previous) {
                price += getCosts(previous[key].value, current[key].value);
            }
        
            if(price) {
                this._pointsAvailable -= price;
                this.pointsAvailableChange.emit(this._pointsAvailable);
            }
        });
    }
    
    registerOnChange(fn : any) : void {
        this.subscription.unsubscribe();
        this.subscription = combineLatest(
            this.form.statusChanges,
            this.form.valueChanges,
            this.pointsAvailableChange
        )
            .pipe(startWith([this.form.status, this.form.value, 0]))
            .subscribe(([status, value, pointsAvailable]) => {
                if ('VALID' === status && 0 <= pointsAvailable) {
                    fn(value);
                } else {
                    fn(null);
                }
            });
    }
    
    registerOnTouched(fn : any) : void {
    }
    
    setDisabledState(isDisabled : boolean) : void {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
    
    writeValue(obj : any[]) : void {
        while(this.form.length) {
            this.form.removeAt(0);
        }
        if(obj) {
            this.mins = obj.map(o => o.value);
            for(const gift of obj) {
                this.addGift(gift);
            }
        }
    }
    
    protected addGift(gift : IGift) {
        this.form.push(new FormGroup({
            name: new FormControl(gift.name, Validators.required),
            value: new FormControl(gift.value, Validators.required),
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
        
        console.log(result);
        if(result) {
            this.addGift(result);
            this.mins.push(0);
            this.cdr.markForCheck();
        }
    }
}
