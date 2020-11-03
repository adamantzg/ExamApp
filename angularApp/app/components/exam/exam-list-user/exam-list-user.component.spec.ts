import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamListUserComponent } from './exam-list-user.component';

describe('ExamListUserComponent', () => {
  let component: ExamListUserComponent;
  let fixture: ComponentFixture<ExamListUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamListUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
