import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerLogListComponent } from './answer-log-list.component';

describe('AnswerLogListComponent', () => {
  let component: AnswerLogListComponent;
  let fixture: ComponentFixture<AnswerLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
