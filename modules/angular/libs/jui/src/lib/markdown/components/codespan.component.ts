import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MARKDOWN_TOKEN } from '../config';
import { Tokens } from '../markdown-parser.service';


@Component({
    selector       : 'code[__markdown__]',
    template       : `{{ token.code }}`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class CodespanComponent {
    constructor(@Inject(MARKDOWN_TOKEN) public readonly token : Tokens.Codespan) {}
}
