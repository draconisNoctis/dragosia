import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as lunr from 'lunr';
import { parse, Renderer } from 'marked';
import * as path from 'path';

require('lunr-languages/lunr.stemmer.support')(lunr);
require('lunr-languages/lunr.de')(lunr);

async function main() {
    const rootDir = path.resolve(`${__dirname}/../../rules`);
    const files = glob.sync(`${rootDir}/**/*.md`);
    
    const docs : { id : string, doc : string }[] = [];
    
    for(const file of files) {
        const doc = await renderMarkdownFile(file);
        const filename = file.substr(rootDir.length);
        const id = filename.substr(1, filename.length - 4);
        
        docs.push({
            id,
            doc
        })
    }
    
    const index = lunr(function() {
        this.ref('id');
        this.field('doc');
        this.metadataWhitelist = [ 'position' ];
        
        this.use((lunr as any).de);
        
        for(const doc of docs) {
            this.add(doc);
        }
    });
    
    const DOCS : { [ key : string ] : string } = {};
    for(const doc of docs) {
        DOCS[ doc.id ] = doc.doc;
    }
    
    console.log(`export const DOCS = ${JSON.stringify(DOCS, null, 2)};
export const SEARCH_INDEX = ${JSON.stringify(index, null, 2)};
export default SEARCH_INDEX;`);
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

export async function renderMarkdownFile(file : string) : Promise<string> {
    const markdown = await fs.readFile(file, 'utf8');
    
    return parse(markdown, {
        renderer: new TextRenderer()
    })
}
