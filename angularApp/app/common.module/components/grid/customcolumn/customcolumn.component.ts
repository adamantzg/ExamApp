import { Component, OnInit, Input, ComponentFactoryResolver,
  ViewContainerRef, ViewChild } from '@angular/core';
import { GridColumn } from '../grid';

@Component({
  selector: 'app-customcolumn',
  templateUrl: './customcolumn.component.html',
  styleUrls: ['./customcolumn.component.scss']
})
export class CustomcolumnComponent implements OnInit {

  constructor(private resolver: ComponentFactoryResolver
    ) { }

  @Input()
  row: any;
  @Input()
  column: GridColumn;
  component: any;

  @ViewChild('content', /* TODO: add static flag */ { read: ViewContainerRef }) content: any;

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(this.column.customComponentType);
    this.component = this.content.createComponent(factory);
    this.component.instance.row = this.row;
    this.component.instance.column = this.column;
  }

}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ICustomGridColumnComponentContent {
  row: any;
  column: GridColumn;
}
