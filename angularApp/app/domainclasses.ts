
export class User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    admin: boolean | null;
    selected: boolean;
    userCourses: UserCourse[];
    userGroups: UserGroup[];     
}

export class UserCourse {
    id: number;
    idUser: number | null;
    idCourse: number | null;
    idGroup: number | null;
}

export class UserGroup {
    idUser: number;
    idGroup: number;
    group: Group;
    user: User;
}

export class Group {
    id: number;
    name: string;
    userGroups: UserGroup[];
    userCourses: UserCourse[];
}

export class Exam {
    id: number;
    title: string;
    startDateTime: Date | null;
    idCourse: number | null;
    maxTime: number | null;
    idType: number | null;
    idDatabase: number | null;
    randomOrder: boolean | null;
    questions: Question[] = [];
    submissions: Submission[];
    examResources: ExamResource[] = [];
    examUsers: ExamUser[] = [];
    status: string;
    database: Database;
    formattedTime: string;
    showResults: boolean | null;
    timeConstrained: boolean | null;
    duration: Date | null;
    userSpecificDb: boolean;

    points: number;
    totalPoints: number;
    result: string;
}

export class Question {
    id: number;
    idType: number | null;
    idExam: number | null;
    questionText: string;
    orderNo: number | null;
    idDatabase: number | null;
    records: number;
    points: number;
    questionChoices: QuestionChoice[];
    questionResources: QuestionResource[];
    children: Question[];
    parent: Question;
    idParent: number;

    submissionAnswer: SubmissionAnswer;
}

export class Submission {
    id: number;
    idExam: number | null;
    idUser: number | null;
    timeStarted: Date | null;
    timeLastSaved: Date | null;
    timeSubmitted: Date | null;
    ipAddress: string;
    submissionAnswers: SubmissionAnswer[];
    exam: Exam;
    user: User;
}

export class ExamResource {
    idExam: number;
    idResource: number;
    resource: Resource;
}

export class ExamUser {
    constructor(idExam: number, idUser: number) {
        this.idUser = idUser;
        this.idExam = idExam;
    }
    idExam: number;
    idUser: number;
    user: User;
}

export class QuestionChoice {
    id: number;
    idQuestion: number | null;
    choiceText: string;
    correct: number | null;
}

export class QuestionResource {
    idQuestion: number;
    idResource: number;
    resource: Resource;
}

export class SubmissionAnswer {
    id: number;
    idSubmission: number | null;
    idQuestion: number | null;
    answerText: string;
    question: Question;
    points: number;
    submissionAnswerChoices: SubmissionAnswerChoice[];
    totalRecords: number;
    logs: SubmissionAnswerLog[] = [];
    childAnswers: SubmissionAnswer[] = [];

    questionType: number;
}

export class Resource {
    id: number;
    name: string;
    data: string;
}

export class SubmissionAnswerChoice {
    idSubmissionAnswer: number;
    idChoice: number;

    choice: QuestionChoice;
    
}

export class SubmissionAnswerLog {
    id: number;
    idSubmissionAnswer: number | null;
    dateTimeChanged: Date | null;
    answerText: string;
}

export class Course {
    id: number;
    name: string;
}

export class Database {
    id: number;
    name: string;
}

export class ExamType {
    id: number;
    name: string;
}

export class QuestionType {    
    id: number;
    name: string;
}

export enum QuestionTypeValue {
    multipleChoice = 1,
    sql = 2,
    sqlAction = 3,
    group = 4
}