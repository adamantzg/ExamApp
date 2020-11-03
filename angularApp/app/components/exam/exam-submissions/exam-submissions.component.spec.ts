import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSubmissionsComponent } from './exam-submissions.component';

describe('ExamSubmissionsComponent', () => {
  let component: ExamSubmissionsComponent;
  let fixture: ComponentFixture<ExamSubmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSubmissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
