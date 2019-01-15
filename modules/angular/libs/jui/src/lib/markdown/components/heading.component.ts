import { ChangeDetectionStrategy, Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../config';
import { Token, Tokens } from '../markdown-parser.service';
import { AbstractMarkdownComponent, MARKDOWN_TEMPLATE } from './markdown.component';


export abstract class HeadingComponent extends AbstractMarkdownComponent {
    tokens : Token[];
    
    get slug() {
        return this.token.slug;
    }
    
    constructor(public readonly token : Tokens.Heading,
                injector : Injector,
                config : IMarkdownConfig) {
        super(injector, config);
        this.tokens = token.children;
    }
}

@Component({
    selector       : 'h1[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None,
    host: {
        '[attr.id]': 'slug'
    }
})
export class H1Component extends HeadingComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Heading,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}

@Component({
    selector       : 'h2[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None,
    host: {
        '[attr.id]': 'slug'
    }
})
export class H2Component extends HeadingComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Heading,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}

@Component({
    selector       : 'h3[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None,
    host: {
        '[attr.id]': 'slug'
    }
})
export class H3Component extends HeadingComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Heading,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}

@Component({
    selector       : 'h4[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None,
    host: {
        '[attr.id]': 'slug'
    }
})
export class H4Component extends HeadingComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Heading,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}

@Component({
    selector       : 'h5[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None,
    host: {
        '[attr.id]': 'slug'
    }
})
export class H5Component extends HeadingComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Heading,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}

@Component({
    selector       : 'h6[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None,
    host: {
        '[attr.id]': 'slug'
    }
})
export class H6Component extends HeadingComponent {
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Heading,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
    }
}
