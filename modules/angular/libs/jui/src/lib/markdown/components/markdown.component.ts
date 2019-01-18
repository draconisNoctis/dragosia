import { HttpClient } from '@angular/common/http';
import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component, EventEmitter,
    Inject,
    Injector,
    Input, OnChanges,
    Optional, Output, SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../config';
import { MarkdownParserService, Token, Tokens } from '../markdown-parser.service';

const ITEM_IDS = new WeakMap<Token, string>();

export abstract class AbstractMarkdownComponent {
    abstract tokens?: Token[];
    
    constructor(protected readonly injector : Injector,
                protected readonly config : IMarkdownConfig) {
    }
    
    getComponentForToken(token : Token) {
        return this.config.components[ token.type ];
    }
    
    getInjectorForToken(token : Token) {
        return Injector.create({
            parent   : this.injector,
            providers: [
                { provide: MARKDOWN_TOKEN, useValue: token }
            ]
        });
    }
    
    trackBy(index : number, token : Token) {
        if(!ITEM_IDS.has(token)) {
            return ITEM_IDS.set(token, Math.random().toString(32));
        }
        return ITEM_IDS.get(token);
    }
}

export const MARKDOWN_TEMPLATE = `<ng-container *ngFor="let token of tokens; trackBy: trackBy">
    <ng-container *ngIf="token.type === 'text'">{{ token.text }}</ng-container>
    <ng-container *ngIf="token.type !== 'text'"><ng-template [ngComponentOutlet]="getComponentForToken(token)" [ngComponentOutletInjector]="getInjectorForToken(token)"></ng-template></ng-container>
</ng-container>`;

@Component({
    selector: 'jui-markdown, [juiMarkdown]',
    template: MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent extends AbstractMarkdownComponent {
    @Input('juiMarkdown')
    set markdown(markdown : string) {
        if(markdown) {
            this.tokens = this.parser.parse(markdown);
            this.parsed.emit(this.tokens);
        } else {
            this.tokens = [];
        }
    }
    
    protected loadSubscription = Subscription.EMPTY;
    
    @Input()
    set src(src : string) {
        this.loadSubscription.unsubscribe();
        this.tokens = [];
        this.loadSubscription = this.http.get(src, { responseType: 'text' }).subscribe(text => {
            this.loaded.emit(text);
            this.tokens = this.parser.parse(text);
            this.parsed.emit(this.tokens);
            this.cdr.markForCheck();
        }, err => this.error.emit(err));
    }
    
    @Output()
    loaded = new EventEmitter<string>();
    
    @Output()
    parsed = new EventEmitter<Token[]>();
    
    @Output()
    error = new EventEmitter<any>();
    
    tokens?: Tokens.BlockToken[];
    
    constructor(protected readonly parser : MarkdownParserService,
                protected readonly cdr : ChangeDetectorRef,
                @Optional() protected readonly http : HttpClient,
                injector: Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}
