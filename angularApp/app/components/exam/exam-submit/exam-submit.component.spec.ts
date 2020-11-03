import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSubmitComponent } from './exam-submit.component';

describe('ExamSubmitComponent', () => {
  let component: ExamSubmitComponent;
  let fixture: ComponentFixture<ExamSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
