import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionLabelComponent } from './question-label.component';

describe('QuestionLabelComponent', () => {
  let component: QuestionLabelComponent;
  let fixture: ComponentFixture<QuestionLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
