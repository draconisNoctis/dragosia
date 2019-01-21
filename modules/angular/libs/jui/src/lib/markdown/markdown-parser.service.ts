import { Injectable } from '@angular/core';
import { parse, Renderer } from 'marked';


export namespace Tokens {
    export type Text = { type: 'text', text: string };
    export type Code = { type: 'code', code: string, language: string };
    export type BlockQuote = { type: 'blockquote', children: InlineToken[] };
    export type Html = { type: 'html', html: string };
    export type H1 = { type: 'h1', depth: string, slug: string, children: InlineToken[] };
    export type H2 = { type: 'h2', depth: string, slug: string, children: InlineToken[] };
    export type H3 = { type: 'h3', depth: string, slug: string, children: InlineToken[] };
    export type H4 = { type: 'h4', depth: string, slug: string, children: InlineToken[] };
    export type H5 = { type: 'h5', depth: string, slug: string, children: InlineToken[] };
    export type H6 = { type: 'h6', depth: string, slug: string, children: InlineToken[] };
    export type Hr = { type: 'hr' };
    export type Br = { type: 'br' };
    export type OrderedList = { type: 'orderedlist', start: string|number, children: ListItem[] };
    export type UnorderedList = { type: 'unorderedlist', start: string|number, children: ListItem[] };
    export type ListItem = { type: 'listitem', children: InlineToken[] };
    export type Paragraph = { type: 'paragraph', children: InlineToken[] };
    export type Strong = { type: 'strong', children: InlineToken[] };
    export type Em = { type: 'em', children: InlineToken[] };
    export type Del = { type: 'del', children: InlineToken[] };
    export type Codespan = { type: 'codespan', code: string };
    export type Link = { type: 'link', href: string, title: string, children: InlineToken[] };
    export type Image = { type: 'image', src: string, title: string, alt: string };
    export type Table = { type: 'table', header: Tr<Th>[], body: Tr<Td>[] }
    export type Tr<T> = { type: 'tr', children: T[] }
    export type Td = { type: 'td', align: "center" | "left" | "right" | null, children: InlineToken[] };
    export type Th = { type: 'th', align: "center" | "left" | "right" | null, children: InlineToken[] };
    
    export type Heading = H1 | H2 | H3 | H4 | H5 | H6;
    export type List = OrderedList | UnorderedList;
    export type BlockToken = Code | BlockQuote | Html | Heading | Hr | Br | List | Paragraph | Table;
    export type InlineToken = Text | Strong | Em | Del | Codespan | Link | Image;
}

export type Token = Tokens.BlockToken | Tokens.InlineToken | Tokens.ListItem | Tokens.Tr<Tokens.Td|Tokens.Th> | Tokens.Td | Tokens.Th;

@Injectable({
    providedIn: 'root'
})
export class MarkdownParserService {
    
    parse(markdown : string) : Tokens.BlockToken[] {
        const parsed = parse(markdown, {
            renderer: new JsonRenderer()
        });
    
        return JSON.parse('[' + parsed.substr(0, parsed.length - 2) + ']');
    }
}

export class JsonRenderer extends Renderer {
    code(code : string, language : string, isEscaped : boolean) : string {
        return JSON.stringify({ type: 'code', code: isEscaped ? unescape(code) : code, language }) + ',\n';
    }
    
    blockquote(quote : string) : string {
        return JSON.stringify({ type: 'blockquote', children: this._text(quote, true) }) + ',\n';
    }
    
    html(html : string) : string {
        return JSON.stringify({ type: 'html', html }) + ',\n';
    }
    
    heading(text : string, level : number, raw : string, slugger : marked.Slugger) : string {
        return JSON.stringify({ type: `h${level}`, children: this._text(text, true), slug: slugger.slug(raw) }) + ',\n'
    }
    
    hr() : string {
        return JSON.stringify({ type: 'hr' }) + ',\n';
    }
    
    list(body : string, ordered : boolean, start : number) : string {
        return JSON.stringify({ type: ordered ? 'orderedlist' : 'unorderedlist', start, children: this._text(body, true) }) + ',\n';
    }
    
    listitem(text : string) : string {
        return JSON.stringify({ type: 'listitem', children: this._text(text, true) }) + ',\n';
    }
    
    paragraph(text : string) : string {
        return JSON.stringify({ type: 'paragraph', children: this._text(text, true) }) + ',\n';
    }
    
    table(header : string, body : string) : string {
        return JSON.stringify({ type: 'table', header: this._text(header, true), body: this._text(body, true) }) + ',\n';
    }
    
    tablerow(content : string) : string {
        return JSON.stringify({ type: 'tr', children: this._text(content, true) }) + ',\n';
    }
    
    tablecell(content : string, flags : { header : boolean; align : "center" | "left" | "right" | null }) : string {
        return JSON.stringify({ type: flags.header ? 'th' : 'td', align: flags.align, children: this._text(content, true) }) + ',\n';
    }
    
    strong(text : string) : string {
        return JSON.stringify({ type: 'strong', children: this._text(text, true) }) + ',\n';
    }
    
    em(text : string) : string {
        return JSON.stringify({ type: 'em', children: this._text(text, true) }) + ',\n';
    }
    
    codespan(code : string) : string {
        return JSON.stringify({ type: 'codespan', code: this.unescape(code) }) + ',\n';
    }
    
    br() : string {
        return JSON.stringify({ type: 'br' }) + ',\n';
    }
    
    del(text : string) : string {
        return JSON.stringify({ type: 'del', children: this._text(text, true) }) + ',\n';
    }
    
    link(href : string, title : string, text : string) : string {
        return JSON.stringify({ type: 'link', children: this._text(text, true), title, href }) + ',\n';
    }
    
    image(src : string, title : string, alt : string) : string {
        return JSON.stringify({ type: 'image', src, title, alt }) + ',\n';
    }
    
    protected _text(text : string, wrap = false) {
        const WRAPPED_REGEXP = /^\[.*\]$/;
        if(!WRAPPED_REGEXP.test(text)) {
            text = text.replace(/(.{0,11})\[({"type":"text","text":")/g, (_, before, $1) => {
                if('"children":' === before) {
                    return `${before}[${$1}`;
                }
                return $1 + '[';
            });
        }
        try {
            return wrap && !WRAPPED_REGEXP.test(text) ? JSON.parse(`[${text}]`) : JSON.parse(text);
        } catch {
            try {
                return wrap && !WRAPPED_REGEXP.test(text) ? JSON.parse('[' + text.replace(/[,\n]+$/g, '') + ']') :  JSON.parse(text.replace(/[,\n]+$/g, ''));
            } catch {
                return [ { type: 'text', text } ];
            }
        }
    }
    
    protected unescape(text) {
        return text.replace(/&quot;/g, '"')
            .replace(/&#(\d{2,5});/g, (_, n) => String.fromCharCode(+n));
    }
    
    text(text : string) : string {
        return JSON.stringify({ type: 'text', text: this.unescape(text) }) + ',\n';
    }
}
