import { InjectionToken, Type } from '@angular/core';
import { Token } from './markdown-parser.service';

export const RAW_MARKDOWN_CONFIG = new InjectionToken<IMarkdownRawConfig|undefined>('Markdown Raw Config');

export const MARKDOWN_CONFIG = new InjectionToken<IMarkdownConfig>('Markdown Config');

export const MARKDOWN_TOKEN = new InjectionToken<Token>('Markdown Token');

export interface IMarkdownConfig {
    sanitizeHtml: boolean;
    trustHtml: boolean;
    components: {
        h1: Type<any>;
        h2: Type<any>;
        h3: Type<any>;
        h4: Type<any>;
        h5: Type<any>;
        h6: Type<any>;
        code: Type<any>;
        codespan: Type<any>;
        paragraph: Type<any>;
        blockquote: Type<any>;
        unorderedlist: Type<any>;
        orderedlist: Type<any>;
        listitem: Type<any>;
        strong: Type<any>;
        em: Type<any>;
        del: Type<any>;
        link: Type<any>;
        image: Type<any>;
        br: Type<any>;
        hr: Type<any>;
        table: Type<any>;
        tr: Type<any>;
        td: Type<any>;
        th: Type<any>;
        html: Type<any>;
    }
}

export interface IMarkdownRawConfig {
    sanitizeHtml?: boolean;
    trustHtml?: boolean;
    components?: Partial<IMarkdownConfig['components']>
}
