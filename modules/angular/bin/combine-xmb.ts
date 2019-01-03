import * as yargs from 'yargs';
import * as glob from 'glob';
import { xmbLoadToXml, xmbWrite } from '@ngx-translate/i18n-polyfill/src/serializers/xmb';
import { MessageBundle } from '@ngx-translate/i18n-polyfill/extractor/src/message-bundle'
import { readFileSync, writeFileSync } from 'fs';
import { XmlMessagesById } from '@ngx-translate/i18n-polyfill/src/serializers/serializer';
import { xtbDigest, xtbMapper } from '@ngx-translate/i18n-polyfill/src/serializers/xtb';

export async function main(args : string[]) : Promise<void> {
    const cli : { input: string[], outFile: string, locale: string } = yargs
        .usage('Combines multiple xmb files into one.\nUsage: $0 [options]')
        .help('help')
        .alias('help', 'h')
        .option('input', {
            alias: 'i',
            describe: 'File or glob pattern to include',
            type: 'array',
            normalize: true,
            required: true
        })
        .check(options => {
            if(!options.input || 0 === options.input.length) {
                throw new Error('Input required')
            }

            options.input.forEach((path: string) => {
                const files = glob.sync(path);

                if(!files || 0 === files.length) {
                    throw new Error(`The path you supplied was not found or did not match any files: '${path}'`);
                }
            });

            return true;
        })
        .option('out-file', {
            alias: 'o',
            describe: 'Filename to write to',
            type: 'string',
            normalize: true,
            required: true
        })
        .option("locale", {
            alias: "l",
            describe: "Source language of the application",
            default: "en",
            type: "string",
        })
        .parse(args) as any;

    const files : string[] = [];


    cli.input.forEach(path => {
        files.push(...glob.sync(path));
    });

    let xmlMessagesById : XmlMessagesById = {};

    const messages = files.map(file => xmbLoadToXml(readFileSync(file, 'utf8')));

    for(const msg of messages) {
        xmlMessagesById = { ...xmlMessagesById, ...msg };
    }

    const bundle = new MessageBundle(cli.locale);

    writeFileSync(cli.outFile, bundle.write(xmbWrite, xtbDigest, xmlMessagesById, xtbMapper));
}

if(require.main === module) {
    const args = process.argv.slice(2);
    main(args).catch(err => {
        console.error(err);
        process.exit(1);
    });
}
