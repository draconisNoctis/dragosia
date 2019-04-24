import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { getCosts, IGift, IPartialGift, Presets } from '@jina-draicana/presets';
import { FACTOR_SKILLS } from '../factors';
import { AbstractComponent } from '../abstract.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { RaiseService } from '../raise/raise.service';

export class IncreaseGiftEvent {
    constructor(public readonly gift: IGift,
                public readonly value : number,
                public readonly costs : number) {}
}

@Component({
    selector       : 'js-gifts',
    templateUrl    : './gifts.component.html',
    styleUrls      : [ './gifts.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: [ 'mode' ],
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

    @Input()
    max = Infinity;

    @Input()
    budget = Infinity;

    @Output()
    increase = new EventEmitter<IncreaseGiftEvent>();

    gifts? : IPartialGift[];

    form = new FormArray([]);

    mins : number[] = [];


    constructor(protected readonly dialog : MatDialog,
                protected readonly presets : Presets,
                protected readonly cdr : ChangeDetectorRef,
                protected readonly raiseService : RaiseService) {
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
        this.cdr.markForCheck();
    }

    protected addGift(gift : IGift) {
        this.form.push(new FormGroup({
            name : new FormControl(gift.name, Validators.required),
            value: new FormControl(gift.value || 0, Validators.required),
            level: new FormControl(gift.level)
        }))
    }

    async openAddDialog() {
        const v : IGift[] = this.form.value;
        const ref = this.dialog.open(AddDialogComponent, {
            data: {
                gifts: this.gifts.filter(gift => {
                    return !v.some(g => g.name === gift.name);
                }),
                budget: this.budget
            }
        });

        const result = await ref.afterClosed().toPromise();

        if(result) {
            this.addGift({ ...result });
            this.increase.emit(new IncreaseGiftEvent(result, 0, this.raiseService.getActivationCost(result.level)));
            this.mins.push(1);
            // this.pointsAvailable -= this.factor;
            this.cdr.markForCheck();
        }
    }


    add(index : number) {
        const control = this.form.at(index)!;
        this.increase.emit(new IncreaseGiftEvent({ ...control.value, value: control.value.value + 1 }, control.value.value + 1, this.getCostsForNext(index)));
        control.setValue(control.value.value + 1);
    }


    remove(index: number) {
        const control = this.form.at(index)!.get('value')!;
        control.setValue(control.value - 1);
    }

    delete(index: number) {
        this.form.removeAt(index);
        this.mins.splice(index, 1);
    }

    getCostsForNext(index : number) {
        const control = this.form.at(index)!

        return this.raiseService.getRaiseCosts(control.value.value + 1, control.value.level);
    }
}
