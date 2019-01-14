import { LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCS } from '@dragosia/generic/search-index';
import * as lunr from 'lunr';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { LUNR_INDEX } from '../tokens';


const RANGE_EXPANSION = 50;

@Component({
    selector       : 'dw-search',
    templateUrl    : './search.component.html',
    styleUrls      : [ './search.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host           : {
        'class': 'dw-search'
    }
})
export class SearchComponent {
    query = this.route.queryParamMap.pipe(
        map(m => m.get('q') || ''),
        distinctUntilChanged()
    );
    
    result : Observable<any[]> = this.query.pipe(
        map(q => {
            if(q) {
                return this.index.search(q.split(/\s+/).map(t => {
                    return `${t}~${1 + t.length / 5 | 0}`
                }).join(' '));
            } else {
                return null;
            }
        }),
        map(results => results && results.map(result => {
            const doc = DOCS[ result.ref ];
            const title = doc.split(/\n/)[ 0 ];
            const routerLink = [ '/r', result.ref ];
            const ranges : [ number, number ][] = [];

            const keywords = Object.keys(result.matchData.metadata);

            for(const keyword of keywords) {
                for(const [ start, length ] of result.matchData.metadata[ keyword ].doc.position) {
                    ranges.push([ start, start + length ]);
                }
            }

            let last = ranges[ 0 ].slice();
            for(let i = 1; i < ranges.length;) {
                if(last[ 1 ] >= ranges[ i ][ 0 ]) {
                    last[ 1 ] = ranges[ i ][ 1 ];
                    ranges.splice(i, 1);
                } else {
                    last = ranges[ i ].slice();
                    ++i;
                }
            }


            let start: number;
            let startInSentence: boolean;
            let end: number;
            let endInSentence: boolean;

            const r : any[] = [];

            for(const range of ranges) {
                start = range[ 0 ];
                startInSentence = true;
                while(start >= 0 && start > range[ 0 ] - RANGE_EXPANSION) {
                    if(!doc.charAt(start).match(/[.\n]/)) {
                        --start;
                    } else {
                        ++start;
                        break;
                    }
                }
                start = Math.max(0, start);
                if(start === 0 || doc.charAt(start).match(/[.\n]/)) {
                    startInSentence = false;
                }


                end = range[1];
                endInSentence = true;
                while(end < doc.length && end < range[ 1 ] + RANGE_EXPANSION) {
                    if(!doc.charAt(end).match(/[.\n]/)) {
                        ++end;
                    } else {
                        if(doc.charAt(end) === '.') {
                            ++end;
                        } else {
                            endInSentence = false;
                        }
                        break;
                    }
                }

                r.push({
                    start,
                    end,
                    startInSentence,
                    endInSentence
                })
            }

            const text = r.map((t, i, a) => {
               let str =  doc.substr(t.start, t.end - t.start);
               if(t.startInSentence && 0 === i) {
                   str = '…' + str;
               }
               if(t.endInSentence && a.length - 1 === i) {
                   str += '…';
               }
               return str;
            }).join(' … ');

            return {
                title,
                keywords,
                routerLink,
                link: location.origin + this.locationStrategy.prepareExternalUrl(this.router.createUrlTree(routerLink).toString()),
                text
            }
        }))
    );
    
    constructor(protected readonly route : ActivatedRoute,
                protected readonly router : Router,
                @Inject(LUNR_INDEX) protected readonly index : any/*lunr.Index*/,
                protected readonly locationStrategy : LocationStrategy) {
    }
}
