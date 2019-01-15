import { ChangeDetectionStrategy, Component, HostBinding, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../config';
import { Tokens } from '../markdown-parser.service';
import { AbstractMarkdownComponent, MARKDOWN_TEMPLATE } from './markdown.component';


@Component({
    selector       : 'a[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class LinkComponent extends AbstractMarkdownComponent {
    public tokens = this.token.children;
    
    @HostBinding('attr.href')
    get href() {
        return this.token.href;
    }
    
    @HostBinding('attr.title')
    get title() {
        return this.token.title;
    }
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.Link,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}
