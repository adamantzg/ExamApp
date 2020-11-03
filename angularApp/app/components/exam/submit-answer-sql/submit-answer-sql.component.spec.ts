import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAnswerSqlComponent } from './submit-answer-sql.component';

describe('SubmitAnswerSqlComponent', () => {
  let component: SubmitAnswerSqlComponent;
  let fixture: ComponentFixture<SubmitAnswerSqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitAnswerSqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAnswerSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
