import { Exam, ExamType, Database, Course, QuestionType, User, Question } from "./domainclasses";


export class ExamEditModel {
    exam: Exam;
    examTypes: ExamType[] = [];
    databases: Database[] = [];
    courses: Course[] = [];
    questionTypes: QuestionType[] = [];
    users: User[] = [];
    constructor() {
        this.exam = new Exam();
    }
}

export class QuestionEditModel {
    databases: Database[] = [];
    questionTypes: QuestionType[] = [];
}

export class SqlResults {
    fieldNames: string[] = [];
    data: any[] = [];
    count: number;
    fieldNamesMultiple: string[][];
    multipleData: any[][];
}

export class ExamSubmissionModel {
    questions: number;
    totalPoints: number;
    submissions: ExamSubmission[] = [];    
}

export class ExamSubmission {
    id: number;
    user: User;
    timeStarted: Date | null;
    timeSubmitted: Date | null;
    answers: number;
    points: number;
    percentPoints: number;
}

export enum QuestionEditMoveDirection {
    Up,
    Down
  }
  
  export class QuestionEditMoveEventData {
  
    constructor(question: Question, direction: QuestionEditMoveDirection) {
      this.question = question;
      this.direction = direction;
    }
    question: Question;
    direction: QuestionEditMoveDirection;  
  }