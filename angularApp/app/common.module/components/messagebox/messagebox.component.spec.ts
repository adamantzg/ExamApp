import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageboxComponent } from './messagebox.component';
import { FormsModule } from '@angular/forms';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

describe('MessageboxComponent', () => {
  let component: MessageboxComponent;
  let fixture: ComponentFixture<MessageboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageboxComponent ],
      providers: [BsModalRef],
      imports: [FormsModule, ModalModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
