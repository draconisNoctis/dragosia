import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { delay, pairwise, startWith } from 'rxjs/operators';

@Injectable()
export abstract class AbstractComponent implements ControlValueAccessor {
    @Input()
    mode : 'range' | 'button' = 'range';

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
}

