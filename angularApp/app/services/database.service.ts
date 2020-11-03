import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Database } from "../domainclasses";

@Injectable()
export class DatabaseService {

    constructor(private httpService: HttpService) {

    }

    api = 'api/database';

    getAll() {
        return this.httpService.get(this.api);
    }

    getById(id: number) {
        return this.httpService.get(`${this.api}/${id}`);
    }

    createOrUpdate(d: Database) {
        return d.id > 0 ? this.httpService.put(this.api, d) : this.httpService.post(this.api, d);
    }

    delete(id: number) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
