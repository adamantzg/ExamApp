import { Component, OnInit } from '@angular/core';
import { ExamService, CommonService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { GridDefinition, GridColumn, GridButton, GridColumnType, GridButtonEventData, ColumnDataType } from '../../../common.module';
import { ExamSubmissionModel } from '../../../modelclasses';

@Component({
  selector: 'app-exam-submissions',
  templateUrl: './exam-submissions.component.html',
  styleUrls: ['./exam-submissions.component.scss']
})
export class ExamSubmissionsComponent implements OnInit {

  constructor(private examService: ExamService, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }
  errorMessage = '';

  model: ExamSubmissionModel;

  definition = new GridDefinition(
    [
      new GridColumn('Id', 'id'),
      new GridColumn('Name', 'user.name'),
      new GridColumn('Last Name', 'user.lastname'),
      new GridColumn('Date/Time started', 'timeStarted'),
      new GridColumn('Date/Time submitted', 'timeSubmitted' ),      
      new GridColumn('Answered','answers'),
      new GridColumn('Points', 'points'),
      new GridColumn('%', 'percentPoints'),
      new GridColumn('buttons', null, GridColumnType.ButtonGroup, 'buttons', null, null, null, null, false, null, null, null, false,
      null,
      [
        new GridButton('Details', 'details', '', 'btn btn-sm btn-primary', true),
        
      ])    
    ]
  )

  ngOnInit(): void {
    this.definition.columns[3].dataType = ColumnDataType.Date;
    this.definition.columns[3].format = { format: 'dd.MM.yyyy HH:mm'};
    this.definition.columns[4].dataType = ColumnDataType.Date;
    this.definition.columns[4].format = { format: 'dd.MM.yyyy HH:mm'};
    this.definition.columns[7].dataType = ColumnDataType.Percent;    
    this.definition.columns[7].format = { digits: 0};
    const idExam = +this.activatedRoute.snapshot.params.id;
    this.examService.getSubmissions(idExam).subscribe(
      (m: ExamSubmissionModel) => {
        m.submissions.forEach(s => s.percentPoints = s.points / m.totalPoints);
        this.model = m;
      },
      err => this.errorMessage = this.commonService.getError(err)
    )
  }

  gridButtonClicked(event: GridButtonEventData) {
    if(event.name == 'details') {
      this.router.navigate(['examsubmission', {id: event.row.id}]);
    } 
  }


}
