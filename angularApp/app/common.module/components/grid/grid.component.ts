import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { GridButton, GridButtonEventData, GridColumn, GridColumnType, GridDefinition, GridEditMode, GridEditorType,
ColumnDataType, SortDirection } from './grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [DatePipe, DecimalPipe, CurrencyPipe, PercentPipe]
})
export class GridComponent implements OnInit {

  
  private _definition: GridDefinition;
  dataSet = false;
  definitionSet = false;
  private  _data: any[];
  
  @Input()
  public get data(): any {
    return this._data;
  }
  
  public set data(v: any) {
    this._data = v;
    this.onDataSet();
  }
  
  
  @Input()
  get definition(): GridDefinition {
    return this._definition;
  }
  set definition(value: GridDefinition) {
    this._definition = value;
    this.onDefinitionSet();
  }
  @Output()
  ButtonClicked = new EventEmitter();
  columnTypes = Object.assign({}, GridColumnType);
  dataTypes = Object.assign({}, ColumnDataType);
  fixedHeaderStyle: any;
  @Input()
  style: any = {};
  @Input()
  filter: string;
  @Output()
  SortChange = new EventEmitter();
  @Input()
  css = 'table';
  @Input()
  keyField = 'id';
  @Input()
  editMode = GridEditMode.NoEdit;
  @Input()
  editedRow: any;
  editModes = Object.assign({}, GridEditMode);
  editorTypes = Object.assign({}, GridEditorType);

  editValidation = false;

  form: FormGroup;

  ngOnInit() {
    this.fixedHeaderStyle = { height: this.calculateScrollableHeight(this.style['height']), 'overflow-y': 'auto'};
  }

  buttonClicked(d: any, c: GridColumn, button?: GridButton) {
    if (button != null) {
      if (!button.requiresValidation || this.form.valid) {
        this.ButtonClicked.emit(new GridButtonEventData(c.name, d, button.name));
      }
      if (button.requiresValidation && this.form.invalid) {
        this.editValidation = true;
      }
    } else {
      this.ButtonClicked.emit(new GridButtonEventData(c.name, d));
    }

  }

  calculateScrollableHeight(styleHeight: string) {
    if ( styleHeight != null) {
      const num = +styleHeight.replace('px', '');
      if (num > 0) {
        return (num - 40).toString() + 'px';
      }
    }
    return '';
  }

  getValue(row: any, c: GridColumn) {

    if (c.fieldValueCallback == null) {
      let obj = row;
      const parts = c.field.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
      }
      return obj[parts[parts.length - 1]];
    }
    return c.fieldValueCallback(row);
  }

  checkSort(c: GridColumn) {
    return this.definition.sort != null && this.definition.sort.column.field === c.field;
  }

  toggleSort(c: GridColumn) {
    if (this.definition.sort == null) {
      this.definition.sort = {column : c, direction: SortDirection.Asc};
    } else {
      let direction = SortDirection.Asc;
      if (this.definition.sort.column.field === c.field && this.definition.sort.direction === SortDirection.Asc) {
        direction = SortDirection.Desc;
      }
      this.definition.sort.column = c;
      this.definition.sort.direction = direction;

    }
    this.SortChange.emit(this.definition.sort);
  }

  getSortIconClass() {
    return `glyphicon glyphicon-arrow-${this.definition.sort.direction === SortDirection.Asc ? 'up' : 'down' } sort-icon`;
  }

  checkColumnVisibility(c: GridColumn) {
    if (this.definition.columnVisibilityCallback == null) {
      return true;
    }
    return this.definition.columnVisibilityCallback(c);
  }

  checkColumnButtonVisibility(row: any, c: GridColumn, button: string) {
    if (this.definition.columnButtonVisibilityCallback == null) {
      return true;
    }
    return this.definition.columnButtonVisibilityCallback(row, c.name, button);
  }

  checkColumnGroupDisabledStatus(row: any, c: GridColumn, button: string) {
    if (this.definition.columnButtonDisabledStatusCallback == null) {
      return false;
    }
    return this.definition.columnButtonDisabledStatusCallback(row, c.name, button);
  }

  checkColumnEditorVisibilityStatus(row: any, c: GridColumn) {
    if (this.definition.columnEditorVisibilityStatusCallback == null) {
      return true;
    }
    return this.definition.columnEditorVisibilityStatusCallback(row, c);
  }

  toggleValue(c: GridColumn) {
    this.data.forEach((d: any) => d[c.field] = c.selected);
  }

  checkMode(c: GridColumn) {
    return c.editModes.find(m => m === this.editMode) != null;
  }

  onDefinitionSet() {
    this.definitionSet = true;
    if(this.dataSet) {
      this.createFormControls();
    }
  }

  onDataSet() {
    this.dataSet = true;
    if(this.definitionSet) {
      this.createFormControls();
    }
  }

  createFormControls() {
    const controls: any = {};
    this._definition.columns.forEach(c => {
      if (c.editable) {
        controls[c.name] = new FormControl(c.name);
      }
      if (c.type == GridColumnType.Checkbox) {
        for (let i = 0; i < this._data.length; i++) {
          const name = `${i}_${c.name}`;
          controls[name] = new FormControl(c.name);
        }
      }
    });
    
    this.form = new FormGroup(controls);
  }

  onAutoCompleteSelected(c: GridColumn, $event: TypeaheadMatch ) {
    if (c.autoCompleteData.onSelectedCallback != null) {
      c.autoCompleteData.onSelectedCallback($event.item);
    }
  }

  onAutoCompleteLoading(c: GridColumn, $event: boolean) {
    if (c.autoCompleteData.loadingCallback != null) {
      c.autoCompleteData.loadingCallback($event);
    }
  }

}






