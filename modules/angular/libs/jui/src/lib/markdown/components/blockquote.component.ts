import { ChangeDetectionStrategy, Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../config';
import { Tokens } from '../markdown-parser.service';
import { AbstractMarkdownComponent, MARKDOWN_TEMPLATE } from './markdown.component';


@Component({
    selector       : 'blockquote[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class BlockquoteComponent extends AbstractMarkdownComponent {
    public tokens = this.token.children;
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.BlockQuote,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}
