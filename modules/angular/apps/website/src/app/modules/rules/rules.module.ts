import { CommonModule, LocationStrategy } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    HostListener,
    Inject,
    Injector,
    NgModule,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule
} from '@angular/material';
import { Router, RouterModule } from '@angular/router';
import {
    JuiMarkdownModule,
    LinkComponent,
    MARKDOWN_TEMPLATE,
    TABLE_TEMPLATE,
    TableComponent,
    TableHeaderComponent,
    Token,
    Tokens
} from '@jina-draicana/jui';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../../../../../../libs/jui/src/lib/markdown/config';
import { ComponentsModule } from '../../components/components.module';
import { PageComponent } from './page/page.component';

const RULE_PAGE_REGEXP = /^\.\/([\w\/]+)\.md/i;

@Component({
    selector: 'a[__rules_markdown__]',
    template: MARKDOWN_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.title]': 'title'
    }
})
export class RulesLinkComponent extends LinkComponent {
    @HostBinding('attr.href')
    get href() {
        if(this.isInternal) {
            const [ _, page ] = RULE_PAGE_REGEXP.exec(this.token.href)!;
            const route = [ '/r', page ];
            return this.locationStrategy.prepareExternalUrl(this.router.createUrlTree(route).toString());
        }
    }
    
    protected readonly isInternal = RULE_PAGE_REGEXP.test(this.token.href);
    
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Link,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig,
                protected readonly locationStrategy : LocationStrategy,
                protected readonly router : Router) {
        super(token, injector, config);
    }
    
    @HostListener('click', [ '$event' ])
    onClick($event : MouseEvent) {
        if(this.isInternal) {
            this.router.navigateByUrl(this.href);
            $event.preventDefault();
        }
    }
}

const TABLE_STATUS = new WeakMap<Tokens.Table, { sortByColumn: number|null, order:'asc'|'desc'|null }>();

@Component({
    selector: 'table[__rules_markdown__]',
    template: TABLE_TEMPLATE,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RulesTableComponent extends TableComponent {
    get order() : "asc" | "desc" | null {
        return TABLE_STATUS.get(this.token).order
    }
    
    set order(value : "asc" | "desc" | null) {
        TABLE_STATUS.get(this.token).order = value;
    }
    get sortByColumn() : number | null {
        return TABLE_STATUS.get(this.token).sortByColumn;
    }
    
    set sortByColumn(value : number | null) {
        TABLE_STATUS.get(this.token).sortByColumn = value;
    }
    
    protected th : RulesTableHeaderComponent[] = [];
    
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Table,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig) {
        super(token, injector, config);
        if(!TABLE_STATUS.has(token)) {
            TABLE_STATUS.set(token, {
                order: null,
                sortByColumn: null
            });
        }
    }
    
    sort(column : number) {
        if(this.sortByColumn === column) {
            this.order = 'asc' === this.order ? 'desc' : 'asc';
        } else {
            this.sortByColumn = column;
            this.order = 'asc';
        }
        
        this._sort();
    }
    
    getIndex(th : RulesTableHeaderComponent) {
        const index = this.th.indexOf(th);
        if(-1 < index) {
            return index;
        }
        
        return this.th.push(th) - 1;
    }
    
    protected _text(tokens : Token[]) : string {
        return tokens.reduce((text, token) => {
            if(token.type === 'text') {
                return text + token.text;
            }
            if('children' in token) {
                return text + this._text(token.children);
            }
        }, '');
    }
    
    protected _sort() {
        this.body.sort((a, b) => {
            return this._text(a.children[this.sortByColumn].children)
                .localeCompare(this._text(b.children[this.sortByColumn].children)) * (this.order === 'asc' ? 1 : -1);
        })
    }
}

@Component({
    selector: 'th[__rules_markdown__]',
    template: `<ng-container *ngIf="this.table.sortByColumn === this.index">
        <ng-container *ngIf="this.table.order === 'asc'">\u2303</ng-container>
        <ng-container *ngIf="this.table.order === 'desc'">\u2304</ng-container>
    </ng-container>${MARKDOWN_TEMPLATE}`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.align]': 'align'
    }
})
export class RulesTableHeaderComponent extends TableHeaderComponent {
    
    index = this.table.getIndex(this);
    
    constructor(@Inject(MARKDOWN_TOKEN) token : Tokens.Th,
                injector : Injector,
                @Inject(MARKDOWN_CONFIG) config : IMarkdownConfig,
                public readonly table : RulesTableComponent) {
        super(token, injector, config);
    }
    
    @HostListener('click')
    onClick() {
        this.table.sort(this.index);
    }
}

@NgModule({
    declarations   : [PageComponent, RulesLinkComponent, RulesTableComponent, RulesTableHeaderComponent],
    imports        : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: ':page', component: PageComponent },
            { path: '', component: PageComponent },
            { path: '*', redirectTo: '/' }
        ]),
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        ComponentsModule,
        JuiMarkdownModule.forRoot({
            components: {
                link: RulesLinkComponent,
                table: RulesTableComponent,
                th: RulesTableHeaderComponent
            }
        })
    ],
    entryComponents: [ RulesLinkComponent, RulesTableComponent, RulesTableHeaderComponent ],
    providers      : []
})
export class RulesModule {
}
