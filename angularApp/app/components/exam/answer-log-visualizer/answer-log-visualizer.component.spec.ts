import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerLogVisualizerComponent } from './answer-log-visualizer.component';

describe('AnswerLogVisualizerComponent', () => {
  let component: AnswerLogVisualizerComponent;
  let fixture: ComponentFixture<AnswerLogVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerLogVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerLogVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
