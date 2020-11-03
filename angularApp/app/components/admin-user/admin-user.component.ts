/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../domainclasses';
import { NgControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import * as moment from 'moment';
import { GridDefinition, GridColumn, GridColumnType, ColumnDataType,
   GridButton, GridButtonEventData, GridEditMode,
  Sort, SortDirection, ColumnAutoCompleteData, MessageboxService, MessageBoxType, MessageBoxCommand, MessageBoxCommandValue } from '../../common.module';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})

export class AdminUserComponent implements OnInit {
  editedUserId = -1;
  userCopy: User = new User();
  users: User[] = [];
  faPlusSquare = faPlusSquare;
  
  errorMessage = '';
  successMessage = '';
  
  currentUser = this.userService.currentUser;
  validation = false;

  placeHolders: any = {
    username: {ok: 'Enter Username', error: 'UserName is required'},
    firstname: {ok: 'Enter First Name', error: 'First Name is required'},
    lastname: {ok: 'Enter Last Name', error: 'Last Name is required'},
    email: {ok: 'Enter e-mail', error: 'E-mail is required'},
    customer: {ok: 'Enter customer code', error: 'Customer code is required'},
  };

  customerLoading = false;

  customerAutoComplete: ColumnAutoCompleteData;

  gridDefinition = new GridDefinition([
    new GridColumn('Id', 'id', GridColumnType.Label, 'id', null, null, null, null, true),
    new GridColumn('Email', 'email', GridColumnType.Label, 'email', null, null, null, null, true),
    new GridColumn('First Name', 'name', GridColumnType.Label, 'name', null, null, null, null, true),
    new GridColumn('Last Name', 'lastname', GridColumnType.Label, 'lastname', null, null, null, null, true),    
    new GridColumn('buttons', null, GridColumnType.ButtonGroup, 'buttons', null, null, null, null, false, null, null, null, false,
      null,
      [
        new GridButton('Update', 'update', 'fa fa-check', 'btn btn-sm btn-success', true),
        new GridButton('Cancel', 'cancel', 'fa-times-circle-o', 'ml-2 btn btn-sm btn-warning'),
        new GridButton('Edit', 'edit', 'fa-pencil-square-o', 'btn btn-sm btn-secondary'),
        new GridButton('Delete', 'delete', 'fa-remove', 'ml-2 btn btn-danger btn-sm')       
      ])
  ],false, true);

  editMode = GridEditMode.NoEdit;
  editModes = Object.assign({}, GridEditMode);

  constructor(
    private userService: UserService,    
    private commonService: CommonService,
    private messageBoxService: MessageboxService
  ) {
    

    this.gridDefinition.sort = {column: this.gridDefinition.columns[3], direction: SortDirection.Asc};
    this.gridDefinition.columnVisibilityCallback = this.checkColumnVisibility.bind(this);
    this.gridDefinition.columnButtonVisibilityCallback = this.checkColumnButtonVisibility.bind(this);
    this.gridDefinition.columnButtonDisabledStatusCallback = this.checkColumnButtonDisabledStatus.bind(this);
    this.gridDefinition.columnEditorVisibilityStatusCallback = this.checkColumnEditorVisibilityStatus.bind(this);
    const requiredFields = ['email', 'name', 'lastname'];
    this.gridDefinition.columns.forEach(c => {
      if (requiredFields.includes(c.name)) {
        c.required = true;
      }
    });
  }

  ngOnInit() {

    this.userService.getUsers().subscribe (
      data => this.users = data
      ,
      (err) => this.errorMessage = this.commonService.getError(err)
    );
  }

  /* trackByIndex(index, value) {
    return index;
  } */
  addNew() {
    this.userCopy = JSON.parse(JSON.stringify(new User()));
    this.userCopy.id = 0;
    this.editMode = GridEditMode.AddNew;
    this.editedUserId = 0;
  }
  
  getPlaceholder(name: string, control: NgControl) {
    if (control.invalid && this.validation) {
      return this.placeHolders[name]['error'];
    }
    return this.placeHolders[name]['ok'];
  }

  
  onEditRow(user: User) {
    this.userCopy = JSON.parse(JSON.stringify(user));    
    // this.role = this.userCopy.roles[0];
    this.editedUserId = user.id;
  }

  onCancelRow() {
    this.editedUserId = -1;
  }
  onUpdateRow() {
    
    const user = this.userCopy;    
    const isNew = user.id === 0;
    this.errorMessage = '';

    this.userService.createOrUpdateUser(user).subscribe( (u: User) => {
      this.errorMessage = '';
      
      if (isNew) {
        this.users.unshift(u);
      } else {
        const existingUser = this.users.find(us => us.id === user.id);
        if (existingUser != null) {
          Object.assign(existingUser, u);
        }

      }
      this.editMode = GridEditMode.NoEdit;
      
    },
    err => this.errorMessage = this.commonService.getError(err)
  );

  }
  onDeleteRow(user: User) {
    this.messageBoxService.openDialog('Delete user?', MessageBoxType.Yesno).subscribe((m: MessageBoxCommand) => {
      if (m.value === MessageBoxCommandValue.Ok) {
        this.errorMessage = '';
        this.userService.deleteUser(user.id).subscribe( () => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index >= 0) {
            this.users.splice(index, 1);
          }         
        },
        err => this.errorMessage = this.commonService.getError(err));

      }
    });

  }

  checkColumnVisibility() {
    
    return true;
  }

  checkColumnButtonVisibility(u: User, _column: string, button: string) {

    if (button === 'edit') {
      return this.editMode === GridEditMode.NoEdit || u.id !== this.userCopy.id;
    } else if (button === 'delete') {
      return (this.editMode === GridEditMode.NoEdit || u.id !== this.userCopy.id);
    } else if (button === 'update' || button === 'cancel') {
      return this.editMode !== GridEditMode.NoEdit && u.id === this.userCopy.id;
    }
    return true;
  }

  checkColumnButtonDisabledStatus(_u: User, _column: GridColumn, button: string) {
    if (button === 'delete' || button === 'edit') {
      return this.editMode !== GridEditMode.NoEdit;
    }
    return false;
  }

  checkColumnEditorVisibilityStatus(_u: User) {
    return true;
  }

  gridButtonClicked($event: GridButtonEventData) {
    this.clearMessages();
    if ($event.name === 'delete') {
      this.onDeleteRow($event.row);
    } else if ($event.name === 'edit') {
      this.onEditRow($event.row);
      this.editMode = GridEditMode.Edit;

    } else if ($event.name === 'cancel') {
      this.editMode = GridEditMode.NoEdit;
    } else if ($event.name === 'update') {
      this.onUpdateRow();
    }
  }

  onSortChanged($event: Sort) {
    this.users.sort((a, b) => (this.userCompare(a, b, $event.column) ? -1 : 1) *
    ($event.direction === SortDirection.Asc ? 1 : -1));
  }

  userCompare(a: any, b: any, col: GridColumn) {
    if (col.dataType !== ColumnDataType.Date) {
      return a[col.field] < b[col.field];
    }
    return a[col.field] == null ||  moment(a[col.field]).isBefore(moment(b[col.field]));
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  

}
