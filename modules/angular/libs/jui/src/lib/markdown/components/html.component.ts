import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    SecurityContext,
    ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IMarkdownConfig, MARKDOWN_CONFIG, MARKDOWN_TOKEN } from '../config';
import { Tokens } from '../markdown-parser.service';


@Component({
    selector       : 'md-html[__markdown__]',
    template       : ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class HtmlComponent {
    
    @HostBinding('innerHTML')
    get src() {
        return this.config.trustHtml ? this.sanizier.bypassSecurityTrustHtml(this.token.html)
            : this.config.sanitizeHtml ? this.sanizier.sanitize(SecurityContext.HTML, this.token.html) : '';
    }
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.Html,
                @Inject(MARKDOWN_CONFIG) protected readonly config : IMarkdownConfig,
                protected readonly sanizier : DomSanitizer) {
    }
}
