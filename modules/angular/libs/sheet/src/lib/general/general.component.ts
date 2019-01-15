import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ICharacterAbout } from '@jina-draicana/presets';
import { AbstractComponent } from '../abstract.component';

@Component({
    selector       : 'js-general',
    templateUrl    : './general.component.html',
    styleUrls      : [ './general.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'js-general mat-typography'
    },
    providers      : [ {
        provide    : NG_VALUE_ACCESSOR,
        useExisting: GeneralComponent,
        multi      : true
    } ]
})
export class GeneralComponent extends AbstractComponent {
    protected defaultFactor = 0;
    
    form = new FormGroup({
        about: new FormGroup({
            name: new FormControl(null, Validators.required),
            race: new FormControl(null, Validators.required),
            culture: new FormControl(null, Validators.required),
            profession: new FormControl(null, Validators.required),
            description: new FormControl(null),
        } as { [P in keyof ICharacterAbout]: FormControl })
    });
    
    writeValue(obj : any) : void {
        this.unregisterSubscriptions();
        if(obj) {
            this.form.patchValue(obj, { emitEvent: false });
        }
        this.registerSubscription();
    }
    
    protected calculatePrice(previous : any, current : any) : number {
        return 0;
    }
}
