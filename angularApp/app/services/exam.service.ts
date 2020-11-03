import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Exam, SubmissionAnswer, Submission } from "../domainclasses";

@Injectable()
export class ExamService {

    constructor(private httpService: HttpService) {

    }

    api = 'api/exam';
    autoSaveInterval = 45;

    getAll() {
        return this.httpService.get(this.api);
    }

    getModel(id?: number) {
        const params: any = {};
        if (id != null) {
            params.id = id;
        }
        return this.httpService.get(this.api + '/getModel', { params });
    }

    getById(id: number) {
        return this.httpService.get(`${this.api}/${id}`);
    }

    createOrUpdate(exam: Exam) {
        return exam.id > 0 ? this.httpService.put(this.api, exam) : this.httpService.post(this.api, exam);
    }

    delete(id: number) {
        return this.httpService.delete(`${this.api}?id=${id}`);
    }

    getAssigned() {
        return this.httpService.get(this.api + '/getAssigned');
    }

    getForSubmission(id: number) {
        return this.httpService.get(this.api + '/getForSubmission', { params: {id: id}});
    }

    executeQuery(idExam: number, a: SubmissionAnswer, idUser?: number) {
        return this.httpService.post(this.api + '/executeQuery?idExam=' + idExam + (idUser ? '&idUser=' + idUser : '')  , a);
    }

    saveExam(exam: Exam) {
        return this.httpService.postNoBlock(this.api + '/saveExam', exam);
    }
    submitExam(exam: Exam) {
        return this.httpService.postNoBlock(this.api + '/submitExam', exam);
    }

    getForReview(id: number) {
        return this.httpService.get(this.api + '/getForReview', { params: {id: id}});
    }

    getSubmissions(idExam: number) {
        return this.httpService.get(this.api + '/submissions', { params: { idExam: idExam}});
    }

    getSubmission(idSubmission: number) {
        return this.httpService.get(this.api + '/submission', { params: {id: idSubmission}});
    }

    updateSubmission(submission: Submission) {
        return this.httpService.put(this.api + '/updateSubmission', submission);
    }

    copyExam(id: number) {
        return this.httpService.get(this.api + '/copy', { params: {id: id}});
    }

    getAnswerLogs(idQuestion: number) {
        return this.httpService.get(this.api + '/submissionAnswerLogs', {params: { idQuestion}});
    }

    resolveStartDate(e: Exam) {
        if(e.startDateTime) {
            return e.startDateTime;
        }
        const submission = e.submissions.find(s => s.timeStarted);
        if(submission) {
            return submission.timeStarted;
        }
        return null;
    }

    resetSubmission(idExam: number, resetAnswers: boolean) {
        return this.httpService.post(this.api + `/resetSubmission?idExam=${idExam}&resetAnswers=${resetAnswers}`, null);
    }
    
}
