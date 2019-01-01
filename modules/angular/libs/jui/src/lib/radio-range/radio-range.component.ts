import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
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
    size = 5;
    
    @Input()
    min = 0;
    
    @Input()
    max?: number;
    
    @Input()
    get deselectable() { return this._deselectable };
    set deselectable(value : any) {
        this._deselectable = value === '' || !!value;
    }
    protected _deselectable = false;
    
    @Input()
    get labeled() { return this._labeled }
    set labeled(labeled : boolean) {
        this._labeled = labeled || '' == labeled as any;
    }
    
    _labeled = false;
    
    get entries() {
        return Array.from(new Array(this.size), (_, i) => i + 1);
    }
    
    onChange = (v : any) => {};
    
    constructor(protected readonly cdr : ChangeDetectorRef) {
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
        this.cdr.markForCheck();
    }
    
    onClick(n : number) {
        if(this.value === n) {
            if(!this.deselectable) {
                return;
            }
            this.value = this.min;
        } else {
            if(n >= this.min && (!this.max || n <= this.max)) {
                this.value = n;
            } else {
                return;
            }
        }
        this.onChange(this.value);
    }
    
}
