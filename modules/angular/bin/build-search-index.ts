import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as lunr from 'lunr';
import { parse, Renderer } from 'marked';
import * as path from 'path';
import * as yaml from 'js-yaml';

require('lunr-languages/lunr.stemmer.support')(lunr);
require('lunr-languages/lunr.de')(lunr);

async function main() {
    const rootDir = path.resolve(`${__dirname}/../..`);
    const files = glob.sync(`${rootDir}/{rules,hintergrund}/**/*.md`);
    
    const docs : { id : string, title, body : string }[] = [];
    
    for(const file of files) {
        const body = await renderMarkdownFile(file);
        const filename = file.substr(rootDir.length);
        const id = filename.substr(1, filename.length - 4);
        const title = body.trim().split(/\r?\n/)[0];
        
        docs.push({
            id,
            title,
            body
        })
    }
    
    for(const { id, title, file } of [
        { id: 'vorteile', title: 'Vorteile', file: `${rootDir}/angular/libs/presets/src/lib/advantages.yml` },
        { id: 'nachteile', title: 'Nachteile', file: `${rootDir}/angular/libs/presets/src/lib/disadvantages.yml` }
    ]) {
        
        const body = yaml.safeLoadAll(await fs.readFile(file, 'utf8')).reduce((body, { name, description, info }) => {
            return body + `${name}\n${markdownToString(description)}${info ? '\n' + markdownToString(info) : ''}\n\n`
        }, '');
        
        docs.push({
            id,
            title,
            body
        })
    }
    
    const index = lunr(function() {
        this.ref('id');
        this.field('title');
        this.field('body');
        this.metadataWhitelist = [ 'position' ];
        
        this.use((lunr as any).de);
        
        for(const doc of docs) {
            this.add(doc);
        }
    });
    
    const DOCS : {
        [ key : string ] : {
            title: string;
            body: string
        }
    } = {};
    
    for(const { id, title, body } of docs) {
        DOCS[ id ] = { title, body };
    }
    
    console.log(`export const DOCS = ${JSON.stringify(DOCS, null, 2)};
export const SEARCH_INDEX = ${JSON.stringify(index, null, 2)};`);
}

if(require.main === module) {
    main().catch(err => {
        console.error(err);
        process.exit(1);
    })
}

export class TextRenderer extends Renderer {
    code(code : string, language : string, isEscaped : boolean) : string {
        return (isEscaped ? unescape(code) : code) + '\n\n';
    }
    
    blockquote(quote : string) : string {
        return quote.replace(/^(.)/mg, '> $1');
    }
    
    html(html : string) : string {
        return '';
    }
    
    heading(text : string, level : number, raw : string, slugger : marked.Slugger) : string {
        return `${text}\n\n`
    }
    
    hr() : string {
        return '';
    }
    
    list(body : string, ordered : boolean, start : number) : string {
        return `${body}\n`;
    }
    
    listitem(text : string) : string {
        return `- ${text}\n`;
    }
    
    paragraph(text : string) : string {
        return `${text}\n\n`;
    }
    
    table(header : string, body : string) : string {
        return `${body}\n`;
    }
    
    tablerow(content : string) : string {
        return `${content}\n`;
    }
    
    tablecell(content : string, flags : { header : boolean; align : "center" | "left" | "right" | null }) : string {
        return `${content}\t`
    }
    
    strong(text : string) : string {
        return text
    }
    
    em(text : string) : string {
        return text
    }
    
    codespan(code : string) : string {
        return `${code}`;
    }
    
    br() : string {
        return '\n';
    }
    
    del(text : string) : string {
        return text;
    }
    
    link(href : string, title : string, text : string) : string {
        return title ? `${text}(${title})` : text;
    }
    
    image(href : string, title : string, text : string) : string {
        return '';
    }
}

export function markdownToString(markdown : string) : string {
    return parse(markdown, {
        renderer: new TextRenderer()
    })
}

export async function renderMarkdownFile(file : string) : Promise<string> {
    const markdown = await fs.readFile(file, 'utf8');
    
    return markdownToString(markdown);
}
