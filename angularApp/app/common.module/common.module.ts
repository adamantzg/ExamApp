import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent, MessageboxComponent } from './components';
import { CustomcolumnComponent } from './components/grid/customcolumn/customcolumn.component';
import { ColumnFormatPipe } from './components/grid/formatPipe';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultipleCheckboxComponent } from './components/multipleCheckbox/multipleCheckbox';
import { MessageboxService } from './components/messagebox/messagebox.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TagInputModule } from 'ngx-chips';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TagInputModule,
    ModalModule.forRoot()

  ],
  declarations: [
    GridComponent, CustomcolumnComponent, ColumnFormatPipe, MultipleCheckboxComponent, MessageboxComponent
  ],
  exports: [
    GridComponent
  ],
  providers: [MessageboxService ],
  entryComponents: [MessageboxComponent]
})
export class CommonAppModule { }
