import { Component, Input } from '@angular/core';
import { ExamService, CommonService } from '../../../services';
import { SubmissionAnswer, QuestionTypeValue } from '../../../domainclasses';
import { SqlResults } from '../../../modelclasses';

@Component({
  selector: 'app-submit-answer-sql-results',
  templateUrl: './submit-answer-sql-results.component.html',
  styleUrls: ['./submit-answer-sql-results.component.scss']
})
export class SubmitAnswerSqlResultsComponent {

  constructor(private examService: ExamService, private commonService: CommonService) { }

  results: any[] = [];
  fieldNames: string[] = [];
  errorMessage = '';
  totalRecords = 0;  
  resultsMultiple: any[][];
  fieldNamesMultiple: any[][];
  topRecords = 20;
  executed = false;

  @Input()
  submissionAnswer: SubmissionAnswer;
  @Input()
  idExam: number;
  @Input()
  showResults = true;

  questionTypes = Object.assign({}, QuestionTypeValue);
  
  execute() {    
    const answer = Object.assign({}, this.submissionAnswer);
    if(answer.question) {
      answer.question = Object.assign({}, answer.question);
      answer.question.submissionAnswer = null;
      answer.question.children = null;
    }    
    this.examService.executeQuery(this.idExam, answer).subscribe(
      (r: SqlResults) => {
        this.fieldNames= r.fieldNames;
        this.results = r.data;        
        this.totalRecords = r.count;
        this.resultsMultiple = r.multipleData;
        this.fieldNamesMultiple = r.fieldNamesMultiple;
        this.errorMessage = '';
        this.executed = true;
      },
      err => this.errorMessage = this.commonService.getError(err)
    )
  }

}


