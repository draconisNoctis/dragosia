import { ChangeDetectionStrategy, Component, HostBinding, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../config';
import { Tokens } from '../markdown-parser.service';
import { AbstractMarkdownComponent, MARKDOWN_TEMPLATE } from './markdown.component';

export const TABLE_TEMPLATE = `<thead *ngIf="header.length > 0">
    <ng-container *ngFor="let token of header"><ng-container [ngSwitch]="token.type">
        <ng-container *ngSwitchDefault><ng-template [ngComponentOutlet]="getComponentForToken(token)" [ngComponentOutletInjector]="getInjectorForToken(token)"></ng-template></ng-container>
    </ng-container></ng-container>
</thead>
<thead>
    <ng-container *ngFor="let token of body"><ng-container [ngSwitch]="token.type">
        <ng-container *ngSwitchDefault><ng-template [ngComponentOutlet]="getComponentForToken(token)" [ngComponentOutletInjector]="getInjectorForToken(token)"></ng-template></ng-container>
    </ng-container></ng-container>
</thead>`

@Component({
    selector       : 'table[__markdown__]',
    template       : TABLE_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class TableComponent extends AbstractMarkdownComponent {
    public tokens = [];
    
    public header : Tokens.Tr<Tokens.Th>[] = this.token.header;
    public body : Tokens.Tr<Tokens.Td>[] = this.token.body;
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.Table,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}

@Component({
    selector       : 'tr[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class TableRowComponent extends AbstractMarkdownComponent {
    public tokens = this.token.children;
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.Tr<Tokens.Td|Tokens.Th>,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}

@Component({
    selector       : 'td[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class TableCellComponent extends AbstractMarkdownComponent {
    public tokens = this.token.children;
    
    @HostBinding('attr.align')
    get align() {
        return this.token.align;
    }
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.Td,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}

@Component({
    selector       : 'th[__markdown__]',
    template       : MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class TableHeaderComponent extends AbstractMarkdownComponent {
    public tokens = this.token.children;
    
    @HostBinding('attr.align')
    get align() {
        return this.token.align;
    }
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.Th,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(injector, config);
    }
}
