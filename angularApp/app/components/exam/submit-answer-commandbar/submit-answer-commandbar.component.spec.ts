import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAnswerCommandbarComponent } from './submit-answer-commandbar.component';

describe('SubmitAnswerCommandbarComponent', () => {
  let component: SubmitAnswerCommandbarComponent;
  let fixture: ComponentFixture<SubmitAnswerCommandbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitAnswerCommandbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAnswerCommandbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
