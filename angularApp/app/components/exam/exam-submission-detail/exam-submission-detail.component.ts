import { Component, OnInit, ViewChild } from '@angular/core';
import { Submission, SubmissionAnswer, QuestionTypeValue} from '../../../domainclasses';
import { ExamService, CommonService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
import { SubmitAnswerSqlComponent } from '../submit-answer-sql/submit-answer-sql.component';
import { SqlResults } from '../../../modelclasses';
import { VisualizerData } from '../answer-log-visualizer/answer-log-visualizer.component';


@Component({
  selector: 'app-exam-submission-detail',
  templateUrl: './exam-submission-detail.component.html',
  styleUrls: ['./exam-submission-detail.component.scss']
})
export class ExamSubmissionDetailComponent implements OnInit {

  constructor(public examService: ExamService, private commonService: CommonService,
    private activatedRoute: ActivatedRoute) { }

  submission: Submission;
  errorMessage = '';
  totalPoints = 0;
  currentAnswer: SubmissionAnswer;
  currentIndex = 0;
  visualizerData: VisualizerData;
  dateFormat = 'HH:mm';
  dictAnswerLogs = {};
  questionTypes = Object.assign({}, QuestionTypeValue);
  

  @ViewChild(SubmitAnswerSqlComponent) answerSql: SubmitAnswerSqlComponent;

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id;
    this.examService.getSubmission(id).subscribe(
      (s: Submission) => {         
        this.submission = s;
        this.visualizerData = new VisualizerData(s);
        this.currentAnswer = s.submissionAnswers[0];
        this.calculatePoints();        
        for(const a of s.submissionAnswers) {
          this.dictAnswerLogs[a.id] = { shown: false, loaded: false};                   
          if(a.childAnswers) {
            a.points = a.childAnswers.map(ca => ca.points).reduce((p,c) => p + c, 0.0);
          }
        }
        this.totalPoints = this.submission.submissionAnswers.filter(a => !a.question.idParent).map(a => a.question.points).reduce((p,c) => p + c, 0.0);
        
        this.getResult();
      },
      err => this.errorMessage = this.commonService.getError(err)
    )
  }

  getPoints() {
    if(this.submission) {
      return this.submission.submissionAnswers.map(a => a.points).reduce((p,c) => p + c,0.0 );
    }
    return 0;
  }

  update() {
    this.examService.updateSubmission(this.submission).subscribe(
      () => {},
      err => this.errorMessage = this.commonService.getError(err)
    )
  }

  next() {
    if(this.currentIndex < this.submission.submissionAnswers.length - 1) {
      this.currentIndex++;
      this.currentAnswer = this.submission.submissionAnswers[this.currentIndex];
      this.calculatePoints();
      this.getResult();
    }
  }

  previous() {
    if(this.currentIndex > 0) {
      this.currentIndex--;
      this.currentAnswer = this.submission.submissionAnswers[this.currentIndex];
      this.getResult();
    }
  }

  showNext() {
    return this.submission && this.currentIndex < this.submission.submissionAnswers.length -1;
  }

  showPrevious() {
    return this.submission && this.currentIndex > 0;
  }

  getResult() {
    if(this.currentAnswer && this.currentAnswer.totalRecords == null) {
      if(this.currentAnswer.question.idType == QuestionTypeValue.sql) {
        this.examService.executeQuery(this.submission.idExam, this.currentAnswer, this.submission.idUser).subscribe(
          (r: SqlResults) => {
            this.currentAnswer.totalRecords = r.count;
          },
          err => this.errorMessage = this.commonService.getError(err)
        )
      }
      
    }
  }

  showFullLog() {
    if(!this.dictAnswerLogs[this.currentAnswer.id].loaded) {
      this.examService.getAnswerLogs(this.currentAnswer.idQuestion).subscribe(
        (data) => {
          this.currentAnswer.logs = data;
          this.dictAnswerLogs[this.currentAnswer.id].loaded = true;
        } ,
        err => this.errorMessage = this.commonService.getError(err)
      )
    }
    this.dictAnswerLogs[this.currentAnswer.id].shown = !this.dictAnswerLogs[this.currentAnswer.id].shown;
  }

  calculatePoints() {
    if(this.currentAnswer && this.currentAnswer.childAnswers && this.currentAnswer.childAnswers.length > 0) {
      this.currentAnswer.points = this.currentAnswer.childAnswers.map(c=>c.points).reduce((a,b) => a + b,0);
    }
  }

}
