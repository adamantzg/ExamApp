import { EventEmitter } from '@angular/core';

export interface IModalDialog {
    onCommand: EventEmitter<MessageBoxCommand>;
}

export enum MessageBoxType {
    Ok,
    Yesno,
    YesNoComment,
    Multiple
  }

  export class MessageBoxCommand {
    value: MessageBoxCommandValue;
    data: any;
    text: string;
    constructor(value: MessageBoxCommandValue, data?: any, text?: string) {
        this.value = value;
        this.data = data;
        this.text = text;
    }

    

    static getCancel() {
        return new MessageBoxCommand(MessageBoxCommandValue.Cancel);
    }

    static getOk(data?: any) {
        return new MessageBoxCommand(MessageBoxCommandValue.Ok, data);
    }

  }

  export enum MessageBoxCommandValue {
    Ok,
    Cancel,
    Custom
  }
