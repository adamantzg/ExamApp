import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Course } from "../domainclasses";

@Injectable()
export class CourseService {

    constructor(private httpService: HttpService) {

    }

    api = 'api/course';

    getAll() {
        return this.httpService.get(this.api);
    }

    getById(id: number) {
        return this.httpService.get(`${this.api}/${id}`);
    }

    createOrUpdate(c: Course) {
        return c.id > 0 ? this.httpService.put(this.api, c) : this.httpService.post(this.api, c);
    }

    delete(id: number) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
