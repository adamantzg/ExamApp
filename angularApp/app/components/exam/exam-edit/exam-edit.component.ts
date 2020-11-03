import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamEditModel, QuestionEditModel, QuestionEditMoveEventData, QuestionEditMoveDirection } from '../../../modelclasses';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Question, ExamUser } from '../../../domainclasses';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { GridDefinition, GridColumn, GridColumnType } from '../../../common.module';
import * as moment from 'moment';
import { QuestionService } from '../../../services/question.service';

@Component({
  selector: 'exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.scss']
})
export class ExamEditComponent implements OnInit {

  constructor(private examService: ExamService, 
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private localeService: BsLocaleService,
    private questionService: QuestionService) { }

  model = new ExamEditModel();  
  questionModel = new QuestionEditModel();
  errorMessage = '';
  title = '';
  faPlus = faPlus;
  newId = -1;
  orderNos: number[] = [];

  userGridDefinition = new GridDefinition(
    [
      new GridColumn('', 'selected', GridColumnType.Checkbox),
      new GridColumn('Name', 'name'),
      new GridColumn('Last Name', 'lastname'),
      new GridColumn('Email', 'email')
    ]
  );
  

  ngOnInit(): void {
    // this.checkMoveButtonVisible.bind(this);
    let id = +this.activatedRoute.snapshot.params.id;
    this.localeService.use('hr');
    if(isNaN(id)) {
      id = null;
    }

    this.examService.getModel(id).subscribe(
      (e: ExamEditModel) => {
        /* const selectedIds = e.exam.examUsers.map(eu => eu.idUser);
        e.users.forEach(u => {
          u.selected = selectedIds.includes(u.id);            
          }
        ); */
        e.exam.duration = moment().startOf('day').add(e.exam.maxTime, 'seconds').toDate();
        this.model = e;        
        this.questionModel = {
          databases : e.databases,
          questionTypes : e.questionTypes
        };
        this.getOrderNos();
        if(id > 0) {
          this.title = 'Edit ' + e.exam.title;  
        } else {
          this.title = 'Create exam';
        }
        
      },
      err => this.errorMessage = this.commonService.getError(err)
    );
  }

  addQuestion() {
      const question = new Question();
      question.children = [];
      question.id = this.newId--;
      question.orderNo = this.questionService.getMaxOrder(this.model.exam.questions)+1;             
      this.model.exam.questions.push(question);
      this.getOrderNos();
  }

  onQuestionDelete(id: number) {
    const deleted = this.questionService.onQuestionDelete(this.model.exam.questions, id);
    if(deleted > 0) {
      this.orderNos = this.questionService.getOrderNos(this.model.exam.questions);
    }
  }

  onQuestionOrderChange(eventData: QuestionEditMoveEventData) {
    this.questionService.onQuestionOrderChange(this.model.exam.questions, this.orderNos, eventData);    
  }

  checkMoveButtonVisible = (eventData: QuestionEditMoveEventData) => {
    if(eventData.direction == QuestionEditMoveDirection.Up) {
      return eventData.question.orderNo != this.questionService.getMinOrder(this.model.exam.questions);
    } else {
      return eventData.question.orderNo != this.questionService.getMaxOrder(this.model.exam.questions);
    }
  }

  getOrderNos() {
    this.orderNos = this.questionService.getOrderNos(this.model.exam.questions);
  }

  save() {
    const exam = JSON.parse(JSON.stringify(this.model.exam));
    exam.questions.forEach((q: any) => {
      if(q.id <= 0) {
        q.id = 0;
      }
      if(q.children) {
        q.children.forEach((qc: any) => {
          if(qc.id <= 0) {
            qc.id = 0;
          }
        })
      }
    });    
    exam.startDateTime = exam.startDateTime ? moment(exam.startDateTime).format('YYYY-MM-DD HH:mm') : null;
    exam.maxTime = moment.duration(moment(exam.duration).diff(moment().startOf('day'))).asSeconds();
    exam.examUsers = this.model.users.filter(u => u.selected).map(u => new ExamUser(this.model.exam.id, u.id));
    this.examService.createOrUpdate(exam).subscribe(
      () => {
        this.router.navigate(['exams']);
      },
      (err) => this.errorMessage = this.commonService.getError(err)
    )
  }

  cancel() {
    this.router.navigate(['exams']);
  }
}
