import { Component, OnInit } from '@angular/core';
import { ExamService, CommonService, UserService } from '../../../services';
import { Exam } from '../../../domainclasses';
import { GridDefinition, GridColumn, GridColumnType, ColumnDataType, GridButtonEventData, GridButton, MessageboxService, MessageBoxType, MessageBoxCommand, MessageBoxCommandValue } from '../../../common.module';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-list-user',
  templateUrl: './exam-list-user.component.html',
  styleUrls: ['./exam-list-user.component.scss']
})
export class ExamListUserComponent implements OnInit {

  constructor(private examService: ExamService, 
    private commonService: CommonService, private router: Router,
    private userService: UserService, private messageBoxService: MessageboxService) { }

  exams: Exam[] = [];
  
  errorMessage = '';
  definition = new GridDefinition([
    new GridColumn('Title','title'),    
    new GridColumn('Course', 'course.name'),
    new GridColumn('Date/Time', 'startDateTime', GridColumnType.Label),
    new GridColumn('Time', 'formattedTime' ),
    new GridColumn('Status', 'status'),
    new GridColumn('Result', 'result'),
    new GridColumn('buttons', null, GridColumnType.ButtonGroup, 'buttons', null, null, null, null, false, null, null, null, false,
      null,
      [
        new GridButton('Start', 'start', '', 'btn btn-sm btn-primary', true),
        new GridButton('Continue', 'continue', '', 'ml-2 btn btn-sm btn-primary'),
        new GridButton('Review', 'review', '', 'btn btn-sm btn-secondary'),
        new GridButton('Reset', 'reset', '', 'btn ml-2 btn-sm btn-warning')
      ])    
  ]);

  ngOnInit(): void {
    this.definition.columns[2].dataType = ColumnDataType.Date;
    this.definition.columns[2].format = { format: 'dd.MM.yyyy HH:mm'};    
    this.definition.columnButtonVisibilityCallback = this.checkColumnButtonVisibility.bind(this);
    this.examService.getAssigned().subscribe(
      (exams: Exam[]) =>  {
        exams.forEach(e => {
          this.processExamFromApi(e);                    
        });
        this.exams = exams;
      },
      (err) => this.errorMessage =  this.commonService.getError(err)
    )
  }

  gridButtonClicked(event: GridButtonEventData) {
    if(event.name == 'start' || event.name == 'continue') {
      this.startExam(event.row.id);
    } else if(event.name == 'review') {
      this.reviewExam(event.row.id);
    } else if(event.name == 'reset') {
      this.messageBoxService.openDialog('This will reset your exam. Click From scratch to remove your previous answers (harder)' +
      ', Keep answers to keep them (easy) or cancel to leave it as it is ',MessageBoxType.Multiple,'Reset exam','Ok', 'Cancel',
      [new MessageBoxCommand(MessageBoxCommandValue.Custom,'new', 'From scratch'),
       new MessageBoxCommand(MessageBoxCommandValue.Custom, 'keep', 'Keep answers')]).subscribe(
         (cmd: MessageBoxCommand) => {
           if(cmd.value != MessageBoxCommandValue.Cancel) {
            this.examService.resetSubmission(event.row.id, cmd.data == 'new').subscribe(
              (e: Exam) => {
                const exam = this.exams.find(x => x.id == event.row.id);
                if(exam != null) {
                  e.totalPoints = exam.totalPoints;
                  e.points = exam.points;
                  this.processExamFromApi(e);
                  Object.assign(exam, e);
                }
              }
            )
           }
         }
       )
    }
  }

  processExamFromApi(e: Exam) {
    const duration = moment.duration(e.maxTime, 'seconds');
    e.formattedTime = this.commonService.displayDuration(duration);
    e.status = this.getStatus(e);
    e.startDateTime = this.examService.resolveStartDate(e);
    if(e.showResults) {
      e.result = `${e.points || 0}/${e.totalPoints} (${(e.points/e.totalPoints*100).toFixed(0)}%)`
    }
  }

  startExam(id: number) {
    this.router.navigate(['examsubmit', {id: id}]);
  }

  reviewExam(id: number) {
    this.router.navigate(['examreview', { id: id}]);
  }

  checkColumnButtonVisibility(e: Exam, _column: string, button: string) {

    
    if (button === 'start') {
      return this.getStatus(e) == 'Ready';
    } else if(button == 'continue')  {
      return this.getStatus(e) == 'In progress';
    } else if(button == 'review') {
      return this.getStatus(e) == 'Submitted' && (!e.timeConstrained || !this.isExamCurrent(e));
    } else if(button == 'reset') {
      return !e.timeConstrained && this.getStatus(e) == 'Submitted';
    }
    
    return true;
  }

  getStatus(e: Exam) {
    const isCurrent = this.isExamCurrent(e);
    const submission = e.submissions.find(s => s.idUser == this.userService.currentUser.id );
    if(submission != null) {
      if(submission.timeSubmitted != null) {
        return 'Submitted';
      }
      if(submission.timeStarted != null) {
        if(isCurrent) {
          return 'In progress';
        } else {
          return 'Expired';
        }        
      }
    }
    return !e.timeConstrained ? 'Ready' :  moment().isBefore(e.startDateTime) ?  'Pending' : isCurrent ? 'Ready' : 'Expired';
  }

  isExamCurrent(e: Exam) {
    return !e.timeConstrained || moment().isBetween(moment(e.startDateTime),moment(e.startDateTime).add(e.maxTime, 'seconds'));
  }

}
