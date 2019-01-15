import { ChangeDetectionStrategy, Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../config';
import { Token, Tokens } from '../markdown-parser.service';
import { AbstractMarkdownComponent, MARKDOWN_TEMPLATE } from './markdown.component';


export abstract class ListComponent extends AbstractMarkdownComponent {
    tokens : Token[];
    
    
    constructor(public readonly token : Tokens.List,
                injector : Injector,
                config : IMarkdownConfig) {
        super(injector, config);
        this.tokens = token.children;
    }
}

@Component({
    selector       : 'ul[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class UnorderedListComponent extends ListComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.UnorderedList,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}


@Component({
    selector       : 'ol[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class OrderedListComponent extends ListComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.OrderedList,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}



@Component({
    selector       : 'li[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class ListItemComponent extends AbstractMarkdownComponent {
    public tokens = this.token.children;
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.ListItem,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}
