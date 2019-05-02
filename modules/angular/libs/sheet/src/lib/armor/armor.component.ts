import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { IArmor, IArmorValues } from '@jina-draicana/presets';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ArmorService } from './armor.service';

@Component({
    selector: 'js-armor',
    templateUrl: './armor.component.html',
    styleUrls: ['./armor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'js-armor mat-typography'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: ArmorComponent,
        multi      : true
    } ]
})
export class ArmorComponent implements ControlValueAccessor {
    public readonly columns = [ 'name', 'head', 'chest', 'back', 'leftArm', 'rightArm' ,'leftLeg', 'rightLeg', 'total', 'handicap', 'action' ];
    public readonly inputColumns = this.columns.map(name => `input-${name}`);

    form = new FormGroup({
        name: new FormControl(null, Validators.required),
        head: new FormControl(),
        chest: new FormControl(),
        back: new FormControl(),
        leftArm: new FormControl(),
        rightArm: new FormControl(),
        leftLeg: new FormControl(),
        rightLeg: new FormControl()
    }, ({ value }) => {
        if(value && !value.head && !value.chest && !value.back && !value.leftArm && !value.rightArm && !value.leftLeg && !value.rightLeg) {
            return { missing: true}
        }
        return null;
    })

    get armor(): IArmor[] {
        return this.dataSource.value;
    }
    set armor(value: IArmor[]) {
        this.dataSource.next(value.map(a => ({ ...a })));
    }

    dataSource = new BehaviorSubject<IArmor[]>([]);

    summary = this.dataSource.pipe(
        map(armor => this.armorService.aggregateArmor(armor))
    )

    protected onChange : any = () => {};

    constructor(protected readonly armorService : ArmorService) {
    }

    writeValue(obj: any): void {
        this.armor = obj || [];
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState?(isDisabled: boolean): void {
        if(isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    remove(index : number) {
        this.armor.splice(index, 1);
        this.armor = this.armor;
        this.onChange(this.armor);
    }

    add() {
        if(!this.form.valid) {
            return;
        }

        const armor = { ...this.form.value };

        armor.head = armor.head || 0;
        armor.chest = armor.chest || 0;
        armor.back = armor.back || 0;
        armor.leftArm = armor.leftArm || 0;
        armor.rightArm = armor.rightArm || 0;
        armor.leftLeg = armor.leftLeg || 0;
        armor.rightLeg = armor.rightLeg || 0;

        this.armor.push(armor);
        this.armor = this.armor;
        this.onChange(this.armor);
        this.form.reset();
    }

    getTotalArmor(values : IArmorValues|null, precise? : boolean) {
        if(!values) {
            return 0;
        }
        return this.armorService.getTotalArmor(values, { precise });
    }

}
