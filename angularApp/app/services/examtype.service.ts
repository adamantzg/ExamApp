import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { ExamType } from "../domainclasses";

@Injectable()
export class ExamTypeService {

    constructor(private httpService: HttpService) {

    }

    api = 'api/examtype';

    getAll() {
        return this.httpService.get(this.api);
    }

    getById(id: number) {
        return this.httpService.get(`${this.api}/${id}`);
    }

    createOrUpdate(examType: ExamType) {
        return examType.id > 0 ? this.httpService.put(this.api, examType) : this.httpService.post(this.api, examType);
    }

    delete(id: number) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
