import { APP_BASE_HREF, DOCUMENT, LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lexer, Slugger } from 'marked';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export interface IPageIndexEntry {
    name: string;
    id: string;
    children: IPageIndexEntry[];
}

@Component({
    selector       : 'dw-page',
    templateUrl    : './page.component.html',
    styleUrls      : [ './page.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-page'
    }
})
export class PageComponent implements OnInit {
    displayBackButton = this.route.paramMap.pipe(
        map(m => m.get('page')),
        map(page => !!page && page !== 'readme')
    );
    
    markdownUrl : Observable<string> = this.route.paramMap.pipe(
        map(m => m.get('page') || 'readme'),
        map(page => `${this.locationStrategy.getBaseHref().replace(/\/$/, '')}/assets/rules/${page}.md`)
    );
    
    index : IPageIndexEntry[] = [];
    
    constructor(protected readonly route : ActivatedRoute,
                protected readonly router : Router,
                @Inject(DOCUMENT) protected readonly document : any,
                protected readonly locationStrategy : LocationStrategy) {
    }
    
    ngOnInit() {
        this.markdownUrl.subscribe();
        this.route.fragment.pipe(
            filter(Boolean),
            map(fragment => this.document.getElementById(fragment)),
            filter(Boolean),
            tap(element => element.scrollIntoView({ behavior: 'smooth' }))
        ).subscribe();
    }
    
    onMarkdownDocumentLoad(str : string) {
        const tokens = lexer(str);
        const slugger = new Slugger();
        
        this.index = [];
        const stack : IPageIndexEntry[] = [ { name: 'root', id: '', children: this.index }];
        for(const token of tokens) {
            if(token.type === 'heading') {
                const entry = { name: token.text, id: slugger.slug(token.text), children: [] };
                
                if(token.depth > stack.length - 1) {
                    if(stack.length) {
                        stack[stack.length - 1]!.children.push(entry);
                    }
                    stack.push(entry);
                } else if(token.depth === stack.length - 1) {
                    stack[stack.length - 2].children.push(entry);
                    stack[stack.length - 1] = entry;
                } else {
                    stack.pop();
                }
            }
        }
    }
    
    onMarkdownDocumentClick($event : MouseEvent) {
        const target = $event.target as HTMLElement;
        const link = target.closest('a[data-route-href]') as HTMLElement|undefined;
    
        if(link && link.dataset.routeHref) {
            $event.preventDefault();
            this.router.navigate(JSON.parse(unescape(link.dataset.routeHref)));
        }
    }
}
