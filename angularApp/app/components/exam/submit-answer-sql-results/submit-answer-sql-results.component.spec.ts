import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAnswerSqlResultsComponent } from './submit-answer-sql-results.component';

describe('SubmitAnswerSqlResultsComponent', () => {
  let component: SubmitAnswerSqlResultsComponent;
  let fixture: ComponentFixture<SubmitAnswerSqlResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitAnswerSqlResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAnswerSqlResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
