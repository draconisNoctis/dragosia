import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'cs-wizard-dialog',
    templateUrl: './wizard-dialog.component.html',
    styleUrls: ['./wizard-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardDialogComponent implements OnInit {
    settingsControl = new FormControl(null, Validators.required);
    backgroundControl = new FormControl(null, Validators.required);

    constructor() {}

    ngOnInit() {}
}
