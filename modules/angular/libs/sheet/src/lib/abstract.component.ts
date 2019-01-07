import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { delay, pairwise, startWith } from 'rxjs/operators';

@Injectable()
export abstract class AbstractComponent implements ControlValueAccessor {
    @Input()
    get pointsAvailable() {
        return this._pointsAvailable;
    }
    
    set pointsAvailable(value : number) {
        this._pointsAvailable = value;
    }
    private _pointsAvailable = 0;
    
    @Input()
    factor = 1;
    
    @Input()
    mode : 'range' | 'button' = 'range';
    
    @Output()
    pointsAvailableChange = new EventEmitter<number>();
    
    abstract form : AbstractControl;
    
    private subscription = Subscription.EMPTY;
    private pointsSubscription = Subscription.EMPTY;
    
    onChange : any = () => {};
    
    registerOnChange(fn : any) : void {
        this.onChange = fn;
        this.unregisterSubscriptions();
        this.registerSubscription();
    }
    
    registerOnTouched(fn : any) : void {
    }
    
    setDisabledState(isDisabled : boolean) : void {
        if(isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
    
    abstract writeValue(obj : any) : void;
    
    protected unregisterSubscriptions() {
        this.subscription.unsubscribe();
        this.pointsSubscription.unsubscribe();
    }
    
    protected transformValue(value : any) : any {
        return value;
    }
    
    protected registerSubscription() {
        this.pointsSubscription = this.form.valueChanges.pipe(startWith(this.form.value), pairwise()).subscribe(([ previous, current ]) => {
            const price = this.calculatePrice(previous, current);
        
            if(price) {
                this.pointsAvailable -= price * this.factor;
                this.pointsAvailableChange.emit(this.pointsAvailable);
            }
        });
        this.subscription = combineLatest(
            this.form.statusChanges,
            this.form.valueChanges
        )
            .pipe(delay(10))
            .subscribe(([ status, value ]) => {
                if('VALID' === status) {
                    this.onChange(this.transformValue(value));
                } else {
                    this.onChange(null);
                }
            });
    }
    
    protected abstract calculatePrice(previous : any, current : any) : number;
}

