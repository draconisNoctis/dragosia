import { ChangeDetectionStrategy, Component, HostBinding, Inject, ViewEncapsulation } from '@angular/core';
import { MARKDOWN_TOKEN } from '../config';
import { Tokens } from '../markdown-parser.service';


@Component({
    selector       : 'img[__markdown__]',
    template       : ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation  : ViewEncapsulation.None
})
export class ImageComponent {
    
    @HostBinding('attr.src')
    get src() {
        return this.token.src;
    }
    
    @HostBinding('attr.title')
    get title() {
        return this.token.title;
    }
    
    @HostBinding('attr.alt')
    get alt() {
        return this.token.alt;
    }
    
    constructor(@Inject(MARKDOWN_TOKEN) protected readonly token : Tokens.Image) {
    }
}
