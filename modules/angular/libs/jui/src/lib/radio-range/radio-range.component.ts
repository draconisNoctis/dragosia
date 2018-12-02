import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector       : 'jui-radio-range',
    templateUrl    : './radio-range.component.html',
    styleUrls      : [ './radio-range.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: RadioRangeComponent, multi: true }],
    host: {
        'class': 'jui-radio-range',
        '[class.jui-radio-range-labeled]': 'labeled'
    }
})
export class RadioRangeComponent implements OnInit, ControlValueAccessor {
    @Input()
    value?: number;
    
    @Input()
    max = 5;
    
    @Input()
    get labeled() { return this._labeled }
    set labeled(labeled : boolean) {
        this._labeled = labeled || '' == labeled;
    }
    
    _labeled = false;
    
    get entries() {
        return Array.from(new Array(this.max), (_, i) => i + 1);
    }
    
    onChange = (v : any) => {};
    
    constructor() {
    }
    
    ngOnInit() {
    }
    
    registerOnChange(fn : any) : void {
        this.onChange = fn;
    }
    
    registerOnTouched(fn : any) : void {}
    
    setDisabledState(isDisabled : boolean) : void {}
    
    writeValue(obj : any) : void {
        this.value = obj;
    }
    
    onClick(n : number) {
        if(this.value === n) {
            this.value = null;
        } else {
            this.value = n;
        }
        this.onChange(this.value);
    }
    
}
