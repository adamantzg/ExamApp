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
import { HttpService } from './http.service';
let CommonService = class CommonService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    getError(err) {
        if (err.error instanceof Error) {
            return err.error.message;
        }
        if (typeof (err.error) === 'string') {
            return err.error;
        }
        return err.message;
    }
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    getUploadUrl() {
        return 'api/uploadImage';
    }
    getUploadFileUrl() {
        return 'api/uploadFile';
    }
    getTempUrl() {
        return 'api/getTempUrl';
    }
    uploadFile(url, file) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpService.post(url, formData);
    }
    getSetting(name) {
        return this.httpService.get('api/getSetting', { params: { name: name } });
    }
};
CommonService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpService])
], CommonService);
export { CommonService };
//# sourceMappingURL=common.service.js.map