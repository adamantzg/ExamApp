import { TestBed, inject } from '@angular/core/testing';

import { MessageboxService } from './messagebox.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PositioningService } from 'ngx-bootstrap/positioning';


describe('MessageboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageboxService, BsModalService, ComponentLoaderFactory, PositioningService],
      imports: [ModalModule]
    });
  });

  it('should be created', inject([MessageboxService], (service: MessageboxService) => {
    expect(service).toBeTruthy();
  }));
});
