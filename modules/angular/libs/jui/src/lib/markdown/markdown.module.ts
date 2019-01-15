import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BlockquoteComponent } from './components/blockquote.component';
import { BrComponent } from './components/br.component';
import { CodeComponent } from './components/code.component';
import { CodespanComponent } from './components/codespan.component';
import { DelComponent } from './components/del.component';
import { EmComponent } from './components/em.component';
import {
    H1Component,
    H2Component,
    H3Component,
    H4Component,
    H5Component,
    H6Component
} from './components/heading.component';
import { HrComponent } from './components/hr.component';
import { HtmlComponent } from './components/html.component';
import { ImageComponent } from './components/image.component';
import { LinkComponent } from './components/link.component';
import { ListItemComponent, OrderedListComponent, UnorderedListComponent } from './components/list.component';
import { MarkdownComponent } from './components/markdown.component';
import { ParagraphComponent } from './components/paragraph.component';
import { StrongComponent } from './components/strong.component';
import { TableComponent, TableCellComponent, TableHeaderComponent, TableRowComponent } from './components/table.component';
import { IMarkdownConfig, IMarkdownRawConfig, MARKDOWN_CONFIG, RAW_MARKDOWN_CONFIG } from './config';

export function markdownConfigFactory(rawConfig : IMarkdownRawConfig = {}) : IMarkdownConfig {
    return {
        sanitizeHtml: true,
        trustHtml: false,
        ...rawConfig,
        components: {
            h1: H1Component,
            h2: H2Component,
            h3: H3Component,
            h4: H4Component,
            h5: H5Component,
            h6: H6Component,
            code: CodeComponent,
            codespan: CodespanComponent,
            paragraph: ParagraphComponent,
            blockquote: BlockquoteComponent,
            orderedlist: OrderedListComponent,
            unorderedlist: UnorderedListComponent,
            listitem: ListItemComponent,
            strong: StrongComponent,
            em: EmComponent,
            del: DelComponent,
            link: LinkComponent,
            image: ImageComponent,
            br: BrComponent,
            hr: HrComponent,
            table: TableComponent,
            tr: TableRowComponent,
            td: TableCellComponent,
            th: TableHeaderComponent,
            html: HtmlComponent,
            ...rawConfig.components
        }
    }
}

@NgModule({
    imports        : [
        CommonModule
    ],
    declarations   : [
        MarkdownComponent,
        H1Component,
        H2Component,
        H3Component,
        H4Component,
        H5Component,
        H6Component,
        CodeComponent,
        CodespanComponent,
        ParagraphComponent,
        BlockquoteComponent,
        OrderedListComponent,
        UnorderedListComponent,
        ListItemComponent,
        StrongComponent,
        EmComponent,
        DelComponent,
        LinkComponent,
        ImageComponent,
        BrComponent,
        HrComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        TableHeaderComponent,
        HtmlComponent
    ],
    exports        : [
        MarkdownComponent,
        H1Component,
        H2Component,
        H3Component,
        H4Component,
        H5Component,
        H6Component,
        CodeComponent,
        CodespanComponent,
        ParagraphComponent,
        BlockquoteComponent,
        OrderedListComponent,
        UnorderedListComponent,
        ListItemComponent,
        StrongComponent,
        EmComponent,
        DelComponent,
        LinkComponent,
        ImageComponent,
        BrComponent,
        HrComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        TableHeaderComponent,
        HtmlComponent
    ],
    entryComponents: [
        H1Component,
        H2Component,
        H3Component,
        H4Component,
        H5Component,
        H6Component,
        CodeComponent,
        CodespanComponent,
        ParagraphComponent,
        BlockquoteComponent,
        OrderedListComponent,
        UnorderedListComponent,
        ListItemComponent,
        StrongComponent,
        EmComponent,
        DelComponent,
        LinkComponent,
        ImageComponent,
        BrComponent,
        HrComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        TableHeaderComponent,
        HtmlComponent
    ],
    providers      : [
        { provide: MARKDOWN_CONFIG, useFactory: markdownConfigFactory, deps: [ RAW_MARKDOWN_CONFIG ] }
    ]
})
export class JuiMarkdownModule {
    static forRoot(config? : IMarkdownRawConfig) : ModuleWithProviders {
        return {
            ngModule : JuiMarkdownModule,
            providers: [
                { provide: RAW_MARKDOWN_CONFIG, useValue: config }
            ]
        }
    }
}
