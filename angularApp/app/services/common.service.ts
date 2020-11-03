import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http/';
import { HttpService } from './http.service';
import * as moment from 'moment';

@Injectable()
export class CommonService {

  constructor(private httpService: HttpService) { }

  getError(err: HttpErrorResponse): string {
    if (err.error instanceof Error) {
      return err.error.message;
    }
    if (typeof(err.error) === 'string') {
      return err.error;
    }
    return err.message;
  }

  deepClone(obj: any): any {
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

  uploadFile(url: string, file: any) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpService.post(url, formData);
  }

  getSetting(name: string) {
      return this.httpService.get('api/getSetting', { params: {name: name}});
  }

  displayDuration(duration: moment.Duration) {
    return `${this.padValue(duration.hours())}:${this.padValue(duration.minutes())}:${this.padValue(duration.seconds())}`;
  }

  padValue(v: number, length = 2) {
    return v.toString().padStart(length, '0');
  }

 

}
