import { Injectable, EventEmitter } from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import { MessageBoxType, MessageBoxCommand } from '../ModalDialog';
import { MessageboxComponent } from './messagebox.component';



@Injectable()
export class MessageboxService {

  constructor(private bsModalService: BsModalService) { }

  openDialog(message: string, type: MessageBoxType = MessageBoxType.Ok, title?: string,
      okText = 'Ok', cancelText = 'Cancel', commands?: MessageBoxCommand[]): EventEmitter<MessageBoxCommand> {
    const modal = this.bsModalService.show(MessageboxComponent);
    modal.content.text = message;
    modal.content.type = type;
    modal.content.title = title;
    modal.content.commands = commands;
    modal.content.okText = okText;
    modal.content.cancelText = cancelText;
    return modal.content.onCommand;
  }
}


