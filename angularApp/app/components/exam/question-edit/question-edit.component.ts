import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Question, QuestionTypeValue } from '../../../domainclasses';
import { QuestionEditModel, QuestionEditMoveEventData, QuestionEditMoveDirection } from '../../../modelclasses';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { QuestionService } from '../../../services/question.service';




@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss']
})
export class QuestionEditComponent {

  constructor(private questionService: QuestionService) {

  }
  
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  _question: Question = new Question();

  @Input()
  
  public set question(v : Question) {
    this._question = v;
    if(v.children) {
      this.orderNos = this.questionService.getOrderNos(v.children);
    }    
  }
  
  public get question() : Question {
    return this._question;
  } 
  

  @Input()
  questionEditModel: QuestionEditModel;

  @Input()
  indexNo: number;

  @Output()
  onOrderChange = new EventEmitter();

  @Output()
  onDelete = new EventEmitter();

  @Input()
  onCheckButtonVisibility: (eventData: QuestionEditMoveEventData) => boolean;

  types = Object.assign({}, QuestionTypeValue);
  newId = -1;
  orderNos: number[] = [];

  showUp() {
    if(this.onCheckButtonVisibility) {
      return this.onCheckButtonVisibility(new QuestionEditMoveEventData(this.question, QuestionEditMoveDirection.Up));
    }
  }

  showDown() {
    if(this.onCheckButtonVisibility) {
      return this.onCheckButtonVisibility(new QuestionEditMoveEventData(this.question, QuestionEditMoveDirection.Down));
    }
  }

  moveUp() {
    if(this.onOrderChange) {
      this.onOrderChange.emit(new QuestionEditMoveEventData(this.question, QuestionEditMoveDirection.Up));
    }
  }

  moveDown() {
    if(this.onOrderChange) {
      this.onOrderChange.emit(new QuestionEditMoveEventData(this.question, QuestionEditMoveDirection.Down));
    }
  }

  delete() {
    if(this.onDelete) {
      this.onDelete.emit(this.question.id);
    }
  }

  addChild() {
    const question = new Question();
    question.id = this.newId--;
    question.orderNo = this.questionService.getMaxOrder(this.question.children)+1;             
    this.question.children.push(question);
    this.orderNos = this.questionService.getOrderNos(this.question.children);
  }

  onChildDelete(id: number) {
    const deleted = this.questionService.onQuestionDelete(this.question.children, id);
    if(deleted > 0) {
      this.orderNos = this.questionService.getOrderNos(this.question.children);
    }
  }

  onChildOrderChange(eventData: QuestionEditMoveEventData) {
    this.questionService.onQuestionOrderChange(this.question.children, this.orderNos, eventData);    
  }

  checkMoveButtonVisible = (eventData: QuestionEditMoveEventData) => {
    if(eventData.direction == QuestionEditMoveDirection.Up) {
      return eventData.question.orderNo != this.questionService.getMinOrder(this.question.children);
    } else {
      return eventData.question.orderNo != this.questionService.getMaxOrder(this.question.children);
    }
  }
  

}


