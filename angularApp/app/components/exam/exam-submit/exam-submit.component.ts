import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ExamService, CommonService, UserService } from '../../../services';
import { Exam, Question, QuestionTypeValue, SubmissionAnswer } from '../../../domainclasses';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageboxService, MessageBoxType, MessageBoxCommand, MessageBoxCommandValue } from '../../../common.module';
import { SubmitAnswerSqlComponent } from '../submit-answer-sql/submit-answer-sql.component';



@Component({
  selector: 'app-exam-submit',
  templateUrl: './exam-submit.component.html',
  styleUrls: ['./exam-submit.component.scss']
})
export class ExamSubmitComponent implements OnInit, AfterViewInit {

  constructor(private examService: ExamService, 
    private commonService: CommonService, private activatedRoute: ActivatedRoute,
    private messageBoxService: MessageboxService, private router: Router,
    private userService: UserService) { }
  
  errorMessage = '';
  exam: Exam;
  remainingTime = '';
  timer: any = null;
  autoSaveInterval = this.examService.autoSaveInterval;
  currentQuestion: Question;
  currentIndex = 0;
  orderNos: number[] = [];
  questionTypes = Object.assign({}, QuestionTypeValue);
  lastSaved = '';
  autoSaveTick = 0;
  timeCss = '';

  @ViewChildren(SubmitAnswerSqlComponent) answerComponents: QueryList<SubmitAnswerSqlComponent>;

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id;
    this.examService.getForSubmission(id).subscribe(
      (exam: Exam) => { 
        const submission = exam.submissions.find(s => s.idUser == this.userService.currentUser.id);
        exam.questions.forEach(q => {
          if(q.idType != QuestionTypeValue.group) {
            let answer = submission.submissionAnswers.find(a => a.idQuestion == q.id);
            if (answer == null) {
              answer = new SubmissionAnswer();            
              answer.idQuestion = q.id;
              answer.questionType = q.idType;
              /*answer.question = Object.assign({},q);
              answer.question.submissionAnswer = null;
              answer.question.children = null;*/
              submission.submissionAnswers.push(answer);
            }           
            q.submissionAnswer = answer;
          } else {
            for(const qc of q.children) {
              let answer = submission.submissionAnswers.find(a => a.idQuestion == qc.id);
              if (answer == null) {
                answer = new SubmissionAnswer();            
                answer.idQuestion = qc.id;
                answer.questionType = q.idType;
                /*answer.question = Object.assign({},q);
                answer.question.submissionAnswer = null;
                answer.question.children = null;*/
                submission.submissionAnswers.push(answer);
              }           
              qc.submissionAnswer = answer;
            }
          }
          
        });
        exam.startDateTime = this.examService.resolveStartDate(exam);
        this.exam = exam;
        if(submission.timeLastSaved) {
          this.showLastSaved(moment(submission.timeLastSaved));
        }
        this.getRemainingTime();
        this.orderNos = this.exam.questions.map(q => q.orderNo).sort();
        this.currentQuestion = this.getQuestion();
        this.timer = setInterval(()=> this.getRemainingTime(), 1000);
      },
      err => {
        this.errorMessage = this.commonService.getError(err);
        if(this.errorMessage.includes('expired')) {
          this.router.navigate(['myexams']);
        }
      }
    );    
  }

  getRemainingTime() {
    if(this.exam.id) {
      this.autoSaveTick++;
      if(this.autoSaveTick % this.autoSaveInterval == 0) {
        this.save();
      }      
      const duration = moment.duration(moment(this.exam.startDateTime).add(this.exam.maxTime,'seconds').diff(moment()));
      if(duration.asSeconds() >= 0) {
        this.remainingTime = this.commonService.displayDuration(duration);
        if(duration.asSeconds() < 60) {
          if(duration.asSeconds() < 10) {
            this.timeCss = 'time_almostdone';
          } else {
            this.timeCss = 'time_runningOut';
          }          
        } 
      } else {
        clearInterval(this.timer);
        this.remainingTime = 'Submitting exam...';
        this.examService.submitExam(this.exam).subscribe(
          () => {
            this.router.navigate(['myexams']);
          } ,
          (err) => {
            this.errorMessage = this.commonService.getError(err);
            setTimeout(() => {
              this.router.navigate(['myexams']);
            }, 500);
          }
        )
        
      }
    }    
  }
  

  getQuestion() {
    const orderNo = this.orderNos[this.currentIndex];
    return this.exam.questions.find(q => q.orderNo == orderNo);
  }

  next() {
    if(this.currentIndex < this.orderNos.length - 1) {
      this.currentIndex++;
      this.currentQuestion = this.getQuestion();      
    }
  }

  previous() {
    if(this.currentIndex > 0) {
      this.currentIndex--;
      this.currentQuestion = this.getQuestion();      
    }
  }

  showNext() {
    return this.currentIndex < this.orderNos.length -1;
  }

  showPrevious() {
    return this.currentIndex > 0;
  }

  
  submit() {
    
    this.messageBoxService.openDialog('Are you sure you want to submit your exam?', MessageBoxType.Yesno)
    .subscribe(
      (command: MessageBoxCommand) => {
        if(command.value == MessageBoxCommandValue.Ok) {
          clearInterval(this.timer);
          this.examService.submitExam(this.exam).subscribe(
            () => {
              this.router.navigate(['myexams']);
            } ,
            (err) => this.errorMessage = this.commonService.getError(err)
          )
        }
      }
    )
  }

  save() {
    this.examService.saveExam(this.exam).subscribe(
      () => {
        this.showLastSaved(moment()); 
      }
    )
  }

  showLastSaved(m: moment.Moment) {
    this.lastSaved = 'Last saved: ' + m.format('HH:mm:ss');
  }

 
  quit() {
    clearInterval(this.timer);
    this.router.navigate(['myexams']);
  }

  ngAfterViewInit() {
    this.answerComponents.changes.subscribe(
      (list: QueryList<SubmitAnswerSqlComponent>) => {
        const arr = list.toArray();
        if(arr.length > 0) {
          arr[0].focus();
        }
      } );    
    
  }

}
