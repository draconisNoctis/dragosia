import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ICharacterAttributes, Presets } from '@jina-draicana/presets';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
    selector       : 'dw-advantages-disadvantages',
    templateUrl    : './advantages-disadvantages.component.html',
    styleUrls      : [ './advantages-disadvantages.component.scss' ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('details', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    host           : {
        'class': 'dw-advantages-disadvantages'
    }
})
export class AdvantagesDisadvantagesComponent implements OnInit {
    displayedColumns = [ 'type', 'name', 'requirements', 'value' ];

    mode : Observable<'ADVANTAGES' | 'DISADVANTAGES'> = this.route.data.pipe(map(d => d.mode));

    filterControl = new FormControl();

    preset = new BehaviorSubject('dragosia');

    init = new BehaviorSubject<[MatSort, MatPaginator]|null>(null);

    data = combineLatest(this.mode, this.preset).pipe(
        map(([ mode, preset ]) => mode === 'ADVANTAGES'
            ? this.presets.getAdvantagesForPreset(preset)
            : this.presets.getDisadvantagesForPreset(preset)),
        map(data => data.map(d => {
            return {
                type        : d.type === 'gift' ? d.typeGiftName! : this.presets.getTypeName(d.type),
                name        : d.name,
                multi       : d.multi,
                value       : d.value,
                description : d.description,
                info        : d.info,
                requirements: d.requirements,
                incompatible: d.incompatible
            };
        }))
    );

    expanded = new Set<string>();

    dataSource = combineLatest(
        this.data,
        this.init
    ).pipe(
        map(([ data, init ]) => {
            const dataSource = new MatTableDataSource(data);
            dataSource.filterPredicate = (data : any, filter) => {
                filter = filter.toLowerCase();

                if(data.type.toLowerCase().includes(filter)) {
                    return true;
                }

                if(data.name.toLowerCase().includes(filter)) {
                    return true;
                }

                if(data.description.toLowerCase().includes(filter)) {
                    return true;
                }

                if(data.info && data.info.toLowerCase().includes(filter)) {
                    return true;
                }

                return false;
            };

            if(init) {
                const [ sort, paginator ] = init;
                dataSource.sort = sort;
                dataSource.paginator = paginator;
            }

            return dataSource;
        }),
        shareReplay(1)
    );

    @ViewChild(MatSort)
    sort!: MatSort;

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;


    constructor(protected readonly route : ActivatedRoute,
                protected readonly presets : Presets) {
    }

    ngOnInit() : void {
        combineLatest(this.dataSource, this.filterControl.valueChanges).pipe(
            tap(([ dataSource, filter ]) => dataSource.filter = filter)
        ).subscribe();
        this.init.next([this.sort, this.paginator]);
    }

    getAttributeNameShort(name : keyof ICharacterAttributes) {
        return this.presets.getAttributeNameShort(name);
    }

}
