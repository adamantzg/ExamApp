import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User } from "../domainclasses";

@Injectable()
export class UserService {

    constructor(private httpService: HttpService) {

    }
    private _currentUser: User;
    api = 'api/user';

    get currentUser() {
        if (this._currentUser == null) {
          this._currentUser = this.loadUser();
        }
        return this._currentUser;
      }

    getCurrentUser() {
        return this.httpService.get(this.api + '/getcurrent');
    }

    getUsers() {
        return this.httpService.get(this.api);
    }

    saveUser() {
        this.getCurrentUser().subscribe(
            u => {
                this._currentUser = u;
                localStorage.setItem('exam_user', JSON.stringify(u));
            }
        );        
    }

    loadUser(): User {
        const sUser = localStorage.getItem('exam_user');
        if (sUser != null) {
          return JSON.parse(sUser);
        }
        return null;
    }

    removeUser() {
        localStorage.removeItem('exam_user');
    }

    createOrUpdateUser(u: User) {
        return u.id == 0 ? this.httpService.post(this.api, u) : this.httpService.put(this.api, u);
    }

    deleteUser(id: number) {
        return this.httpService.delete(this.api + '?id=' + id);
    }
    
}