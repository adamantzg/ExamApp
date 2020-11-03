import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-question-label',
  templateUrl: './question-label.component.html',
  styleUrls: ['./question-label.component.scss']
})
export class QuestionLabelComponent implements AfterViewInit {

  constructor() { }

  @ViewChild('questionDiv') questionDiv: ElementRef;

  @Input()
  text: string;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {       
    this.disableCopy();
  }

  disableCopy() {
    const qdiv = this.questionDiv;
      qdiv.nativeElement.oncopy = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
      }
      qdiv.nativeElement.oncontextmenu = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
      }
  }


}
