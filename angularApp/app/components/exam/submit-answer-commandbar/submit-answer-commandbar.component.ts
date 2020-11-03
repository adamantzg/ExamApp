import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-submit-answer-commandbar',
  templateUrl: './submit-answer-commandbar.component.html',
  styleUrls: ['./submit-answer-commandbar.component.scss']
})
export class SubmitAnswerCommandbarComponent implements OnInit {

  
  commands = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'INNER JOIN', 'OUTER JOIN', 'GROUP BY', 'LIKE',
   'BETWEEN', 'IN', 'HAVING', 'DATEDIFF', 'SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'INSERT', 'UPDATE', 'CREATE', 'ALTER'];

  @Output()
  commandSelected = new EventEmitter();

  ngOnInit(): void {
    //todo
  }

  onCommand(c: string) {
    if(this.commandSelected) {
      this.commandSelected.emit(c);
    }
  }

}
