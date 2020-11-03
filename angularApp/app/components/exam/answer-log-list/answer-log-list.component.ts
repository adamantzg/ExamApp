import { Component, OnInit, Input } from '@angular/core';
import { SubmissionAnswerLog } from '../../../domainclasses';
import { GridDefinition, GridColumn, ColumnDataType } from '../../../common.module';

@Component({
  selector: 'app-answer-log-list',
  templateUrl: './answer-log-list.component.html',
  styleUrls: ['./answer-log-list.component.scss']
})
export class AnswerLogListComponent implements OnInit {

  constructor() { }

  @Input()
  data: SubmissionAnswerLog[] = [];

  definition = new GridDefinition(
    [
      new GridColumn('Date/Time', 'dateTimeChanged'),
      new GridColumn('Text', 'answerText')
    ]
  )

  ngOnInit(): void {
    this.definition.columns[0].dataType = ColumnDataType.Date;
    this.definition.columns[0].format = { format: 'HH:mm:ss'};
    
  }

}
