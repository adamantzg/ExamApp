import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { Exam } from '../../../domainclasses';
import { GridDefinition, GridColumn, GridColumnType, ColumnDataType, GridButton, GridButtonEventData, MessageboxService, MessageBoxType, MessageBoxCommand, MessageBoxCommandValue } from '../../../common.module';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

@Component({
  selector: 'exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {

  constructor(private examService: ExamService, 
    private commonService: CommonService,
    private router: Router, private messageBoxService: MessageboxService) { }

  errorMessage = '';
  faPlusSq = faPlusSquare;
  exams: Exam[] = [];

  gridDefinition = new GridDefinition([
    new GridColumn('Id', 'id'),
    new GridColumn('Title', 'title'),
    new GridColumn('Type', 'examType.name'),
    new GridColumn('Course', 'course.name'),
    new GridColumn('Date/time', 'startDateTime',GridColumnType.Label, 'startDateTime',null,null, null, null, true, ColumnDataType.Date, 
    {format: 'dd/MM/yyyy HH:mm', locale: 'hr'}
    ),
    new GridColumn('Time', 'formattedTime' ),
    new GridColumn('buttons', null, GridColumnType.ButtonGroup, 'buttons', null, null, null, null, false, null, null, null, false,
      null,
      [
        new GridButton('Edit', 'edit', 'fa-pencil-square-o', 'btn btn-sm btn-secondary'),
        new GridButton('Delete', 'delete', 'fa-remove', 'ml-2 btn btn-danger btn-sm'),
        new GridButton('Submissions', 'submissions', '', 'ml-2 btn btn-primary btn-sm'),
        new GridButton('Copy', 'copy', '', 'ml-2 btn btn-info btn-sm')       
      ])
  ]);

  ngOnInit(): void {
    this.examService.getAll().subscribe(
      (data: Exam[]) => {
        data.forEach(e => {
          e.formattedTime = this.commonService.displayDuration(moment.duration(e.maxTime, 'seconds'));
        });
        this.exams = data
      },
      err => this.errorMessage = this.commonService.getError(err)
    )
  }

  addNew() {
    this.router.navigate(['exam']);
  }

  gridButtonClicked(event: GridButtonEventData) {
    if(event.name == 'edit') {
      this.router.navigate(['exam', {id: event.row.id}]);
    } else if(event.name == 'delete') {
      this.messageBoxService.openDialog('Delete exam?', MessageBoxType.Yesno).subscribe(
        (c: MessageBoxCommand) => {
          if(c.value == MessageBoxCommandValue.Ok) {
            this.examService.delete(event.row.id).subscribe(
              () => {
                const index = this.exams.findIndex(e => e.id == event.row.id);
                if(index >= 0) {
                  this.exams.splice(index,1);
                }
              },
              err => this.errorMessage = this.commonService.getError(err)
            )
          }
        }
      )
    } else if(event.name == 'submissions') {
      this.router.navigate(['examsubmissions', {id: event.row.id }]);
    } else if(event.name == 'copy') {
      this.examService.copyExam(event.row.id).subscribe(
        exam => {
          exam.formattedTime = this.commonService.displayDuration(moment.duration(exam.maxTime, 'seconds'));
          this.exams.push(exam);
        },
        err => this.errorMessage = this.commonService.getError(err)
      )
    }
  }

}
