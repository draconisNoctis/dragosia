import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cs-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SheetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
