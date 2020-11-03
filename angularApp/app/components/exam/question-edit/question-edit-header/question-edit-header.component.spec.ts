import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEditHeaderComponent } from './question-edit-header.component';

describe('QuestionEditHeaderComponent', () => {
  let component: QuestionEditHeaderComponent;
  let fixture: ComponentFixture<QuestionEditHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionEditHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEditHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
