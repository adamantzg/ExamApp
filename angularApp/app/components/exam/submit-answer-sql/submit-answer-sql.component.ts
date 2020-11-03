import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SubmissionAnswer } from '../../../domainclasses';
import { SubmitAnswerSqlResultsComponent } from '../submit-answer-sql-results/submit-answer-sql-results.component';

@Component({
  selector: 'app-submit-answer-sql',
  templateUrl: './submit-answer-sql.component.html',
  styleUrls: ['./submit-answer-sql.component.scss']
})
export class SubmitAnswerSqlComponent implements AfterViewInit {
  

  @ViewChild('answerArea') answerTextElem: ElementRef;
  @ViewChild(SubmitAnswerSqlResultsComponent) result: SubmitAnswerSqlResultsComponent;
    
  @Input()
  readOnly = false;
  @Input()
  forReview = false;

  @Input()
  answer: SubmissionAnswer = new SubmissionAnswer();
  @Input()
  idExam: number;

  buffer = '';

  ngAfterViewInit(): void {
    this.answerTextElem.nativeElement.onpaste = (event: any) => 
    { 
      this.internalPaste();
      event.stopPropagation();
      event.preventDefault();
    }
    this.answerTextElem.nativeElement.oncopy = (event: any) => 
    { 
      this.internalCopy(false);
      event.stopPropagation();
      event.preventDefault();
    }
    this.answerTextElem.nativeElement.oncut = (event: any) => 
    { 
      this.internalCopy(true);
      event.stopPropagation();
      event.preventDefault();
    }

    this.answerTextElem.nativeElement.oncontextmenu = (event: any) => 
    { 
      event.stopPropagation();
      event.preventDefault();
    }
    
    //this.answerTextElem.nativeElement.focus();
  }

  focus() {
    if(this.answerTextElem) {
      this.answerTextElem.nativeElement.focus();
    }
  }

  onCommandBarCommand(c: string) {
    const selectionStart = this.answerTextElem.nativeElement.selectionStart;
    const selectionEnd = this.answerTextElem.nativeElement.selectionEnd;
    if(!this.answer.answerText) {
      this.answer.answerText = '';
    }
    this.answer.answerText = this.answer.answerText.substring(0,selectionStart) + c + this.answer.answerText.substring(selectionEnd);
    this.answerTextElem.nativeElement.focus();
  }

  internalCopy(cut: boolean) {
    const selectionStart = this.answerTextElem.nativeElement.selectionStart;
    const selectionEnd = this.answerTextElem.nativeElement.selectionEnd;
    const text = this.answer.answerText;
    if(selectionEnd > selectionStart) {
      if(selectionStart < text.length && selectionEnd < text.length) {
        this.buffer = text.substring(selectionStart, selectionEnd);
        if(cut) {
          let newText = text.substring(0,selectionStart);
          if(selectionEnd < text.length -1 ) {
            newText += text.substring(selectionEnd);
          }
          this.answer.answerText = newText;
        }
      }
    }
  }

  internalPaste() {
    if(this.buffer.length > 0) {
      const selectionStart = this.answerTextElem.nativeElement.selectionStart;
      const selectionEnd = this.answerTextElem.nativeElement.selectionEnd;
      this.answer.answerText = this.answer.answerText.substring(0,selectionStart) + this.buffer + this.answer.answerText.substring(selectionEnd);
    }
  }

  runResults() {
    if(this.result) {
      this.result.execute();
    }
  }

}
