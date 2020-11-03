import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ExamService, CommonService } from '../../../services';
import { Exam, Question, QuestionTypeValue, SubmissionAnswer } from '../../../domainclasses';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-exam-review',
  templateUrl: './exam-review.component.html',
  styleUrls: ['./exam-review.component.scss']
})
export class ExamReviewComponent implements OnInit, AfterViewInit {

  constructor(private examService: ExamService, 
    private commonService: CommonService, private activatedRoute: ActivatedRoute,
    private router: Router) { }
  
  errorMessage = '';
  exam: Exam = new Exam();
  currentQuestion: Question;
  currentIndex = 0;
  orderNos: number[] = [];
  questionTypes = Object.assign({}, QuestionTypeValue);
  

  @ViewChild('questionDiv') questionDiv: ElementRef;

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id;
    this.examService.getForReview(id).subscribe(
      (exam: Exam) => { 
        const submission = exam.submissions[0];
        exam.questions.forEach(q => {
          if(q.idType != QuestionTypeValue.group) {
            let answer = submission.submissionAnswers.find(a => a.idQuestion == q.id);
            if (answer == null) {
              answer = new SubmissionAnswer();            
              answer.idQuestion = q.id;
              submission.submissionAnswers.push(answer);
            }           
            q.submissionAnswer = answer;
          } else {
            for(const qc of q.children) {
              let answer = submission.submissionAnswers.find(a => a.idQuestion == qc.id);
              if (answer == null) {
                answer = new SubmissionAnswer();            
                answer.idQuestion = qc.id;
                submission.submissionAnswers.push(answer);
              }           
              qc.submissionAnswer = answer;
            }
          }
        });
        this.exam = exam;
        this.orderNos = this.exam.questions.map(q => q.orderNo).sort();
        this.currentQuestion = this.getQuestion();        
      },
      err => this.errorMessage = this.commonService.getError(err)
    );    
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

  padValue(v: number, length = 2) {
    return v.toString().padStart(length, '0');
  }

  

  ngAfterViewInit(): void {
    this.questionDiv.nativeElement.oncopy = (event: any) => {
      event.stopPropagation();
      event.preventDefault();
    }
    this.questionDiv.nativeElement.oncontextmenu = (event: any) => {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  quit() {
    this.router.navigate(['myexams']);
  }

  getAwardedPoints(question: Question) {
    if(question.children) {
      return question.children.map(cq => cq.submissionAnswer.points).reduce((p,c) => p + c, 0) || 0;
    } else {
      return question.submissionAnswer.points || 0;
    }
  }

}
