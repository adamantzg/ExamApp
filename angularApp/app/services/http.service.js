var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BlockUIService } from './block-ui.service';
import { tap } from 'rxjs/operators';
let HttpService = class HttpService {
    constructor(http, blockUIService) {
        this.http = http;
        this.blockUIService = blockUIService;
    }
    post(url, object) {
        this.blockUIService.startBlock();
        return this.http.post(url, object, { headers: this.BuildHeaders() }).pipe(tap(() => this.blockUIService.stopBlock(), () => this.blockUIService.stopBlock()));
    }
    postNoBlock(url, object) {
        return this.http.post(url, object, { headers: this.BuildHeaders() });
    }
    get(url, options) {
        this.blockUIService.startBlock();
        if (options == null) {
            options = {};
        }
        options.headers = this.BuildHeaders();
        return this.http.get(url, options).pipe(tap(() => this.blockUIService.stopBlock(), () => this.blockUIService.stopBlock()));
    }
    getNoBlock(url, options) {
        if (options == null) {
            options = {};
        }
        options.headers = this.BuildHeaders();
        return this.http.get(url, options);
    }
    put(url, object) {
        this.blockUIService.startBlock();
        return this.http.put(url, object, { headers: this.BuildHeaders() }).pipe(tap(() => this.blockUIService.stopBlock(), () => this.blockUIService.stopBlock()));
    }
    putNoBlock(url, object) {
        return this.http.put(url, object, { headers: this.BuildHeaders() });
    }
    BuildHeaders() {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json; charset=utf-8');
        headers = headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return headers;
    }
    delete(url, options) {
        if (options == null) {
            options = {};
        }
        options.headers = this.BuildHeaders();
        return this.http.delete(url, options);
    }
};
HttpService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient, BlockUIService])
], HttpService);
export { HttpService };
//# sourceMappingURL=http.service.js.map