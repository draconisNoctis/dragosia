import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MARKDOWN_TOKEN } from '../config';
import { Tokens } from '../markdown-parser.service';


@Component({
    selector       : 'pre[__markdown__]',
    template       : `<code [attr.data-lang]="token.language">{{ token.code }}</code>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class CodeComponent {
    constructor(@Inject(MARKDOWN_TOKEN) public readonly token : Tokens.Code) {}
}
