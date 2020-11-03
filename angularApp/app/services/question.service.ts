import { Injectable } from "@angular/core";
import { Question } from "../domainclasses";
import { QuestionEditMoveDirection, QuestionEditMoveEventData } from "../modelclasses";

@Injectable()
export class QuestionService {

    onQuestionDelete(questions: Question[], id: number) {
        const index = questions.findIndex(q => q.id == id);
        if (index >= 0) {
            questions.splice(index, 1);            
            return 1;
        }
        return 0;
    }

    getOrderNos(questions: Question[]) {
        return questions.map(q => q.orderNo).sort();
    }

    onQuestionOrderChange(questions: Question[], orderNos: number[],eventData: QuestionEditMoveEventData) {
        const sortedIndex = orderNos.findIndex(n => n == eventData.question.orderNo);
        let otherQuestionNo = -1;
        if(sortedIndex >= 0) {
          if(eventData.direction == QuestionEditMoveDirection.Up) {
            if(sortedIndex > 0) {
              otherQuestionNo = orderNos[sortedIndex-1];
            }
          } else {
            if(sortedIndex < questions.length  -1 ) {
              otherQuestionNo = orderNos[sortedIndex+1];
            }
          }
          if(otherQuestionNo >= 0) {
            const otherQuestion = questions.find(q => q.orderNo == otherQuestionNo);
            if(otherQuestion != null) {
              // swap orderNos
              const temp = otherQuestion.orderNo;
              otherQuestion.orderNo = eventData.question.orderNo;
              eventData.question.orderNo = temp;
            }
          }
        }
    }

    getMinOrder(questions: Question[]) {
        if(questions.length > 0) {
            return Math.min(...questions.map(q => q.orderNo));
        }
        return 0;
    }

    getMaxOrder(questions: Question[]) {
        if(questions.length > 0) {
            return Math.max(...questions.map(q => q.orderNo));
        }
        return 0;
    }
}
