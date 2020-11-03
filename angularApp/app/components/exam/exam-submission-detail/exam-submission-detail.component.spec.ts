import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSubmissionDetailComponent } from './exam-submission-detail.component';

describe('ExamSubmissionDetailComponent', () => {
  let component: ExamSubmissionDetailComponent;
  let fixture: ComponentFixture<ExamSubmissionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSubmissionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSubmissionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
