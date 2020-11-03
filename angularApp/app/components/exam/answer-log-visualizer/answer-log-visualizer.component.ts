import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SubmissionAnswerLog, Submission, SubmissionAnswer } from '../../../domainclasses';
import * as moment from 'moment';


@Component({
  selector: 'app-answer-log-visualizer',
  templateUrl: './answer-log-visualizer.component.html',
  styleUrls: ['./answer-log-visualizer.component.scss']
})
export class AnswerLogVisualizerComponent implements AfterViewInit {

  constructor() { }

  _data: VisualizerData;
  
  blocks: VisualizerBlock[] = [];
  height = '30px';
  allLogs: SubmissionAnswerLog[] = [];
  dictColors = {};

  @ViewChild('container') container: ElementRef;

  @Input()
  public set data(v : VisualizerData) {
    this._data = v;
    if(v) {
      this.allLogs = v.submission.submissionAnswers.map(sa => sa.logs).reduce((a,b) => a.concat(b), []).sort((a,b) => moment(a.dateTimeChanged).diff(b.dateTimeChanged));
      this.buildBlocks();
    }    
  }
  
  public get data() : VisualizerData {
    return this._data;
  }
  
  
   

  ngAfterViewInit(): void {
    this.buildBlocks();
  }

  
  buildBlocks() {
    if(this.container && this.container.nativeElement.clientWidth > 0 && this._data) {
      const examLength = this._data.submission.exam.maxTime;
      const startTime = moment(this._data.submission.exam.startDateTime);
      const interval = this._data.logInterval;
            
      
      const blocks: VisualizerBlock[] = [];
      const answers = this.data.submission.submissionAnswers.filter(a => a.id > 0)
        .concat(this.data.submission.submissionAnswers.filter(a => a.childAnswers).map(a => a.childAnswers)
            .reduce((a1,a2) => a1.concat(a2),[]));
      //fill chunks with blocks
      for (let i = 0; i < this.allLogs.length; i++) {
        const entry = this.allLogs[i];
        const offset = moment(entry.dateTimeChanged).diff(startTime, 'seconds');
      
        const block = new VisualizerBlock();                
        block.answer = answers.find(sa => sa.id == entry.idSubmissionAnswer);
        block.startTime = offset;        
        block.length = interval;
        
        if(!(entry.idSubmissionAnswer in this.dictColors)) {
          block.color = this.getRandomColor(entry.idSubmissionAnswer);
          
        } else {
          block.color = this.dictColors[entry.idSubmissionAnswer].color;
        }
        blocks.push(block);
        
        if(i > 0 && blocks[i-1].startTime + blocks[i-1].length > block.startTime) {
          //check previous interval
          blocks[i-1].length = block.startTime - blocks[i-1].startTime;
        }
      }      
      
      //Merge same blocks
      let currentBlock: VisualizerBlock = null;
      const mergedBlocks: VisualizerBlock[] = [];
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];        
        if(currentBlock == null) {
          currentBlock = block;
        } else {
          if(currentBlock.answer.id != block.answer.id || (block.startTime - (currentBlock.startTime + currentBlock.length)) > 2) {
            mergedBlocks.push(currentBlock);
            currentBlock = block;
          } else {
            currentBlock.length += block.length;
          }
          
        }
         
      }
      if(currentBlock != null) {
        mergedBlocks.push(currentBlock);
      }

      //set css left and width
      for (let i = 0; i < mergedBlocks.length; i++) {
        const block = mergedBlocks[i];
        block.left = `${Math.floor(block.startTime / examLength * 100)}%`;
        block.width = `${Math.max(Math.floor(block.length / examLength * 100),1)}%`;
        block.description = 
        `${block.answer.question.questionText}. From: ${moment(startTime).add(block.startTime, 'seconds').format('HH:mm:ss')}
        To: ${moment(startTime).add(block.startTime + block.length, 'seconds').format('HH:mm:ss')}
        `
      }
      this.blocks = mergedBlocks;

    }
  }

  getRandomColor(idSubmissionAnswer: number) {
    const topColor = 255;
    const rgb = [];
    rgb.push((Math.floor(Math.random()*topColor % topColor)));
    rgb.push((Math.floor(Math.random()*topColor % topColor)));
    rgb.push((Math.floor(Math.random()*topColor % topColor)));
    let sum = this.sum(rgb);

    //if too light, darken it
    if(sum > 3*192) {
      const max = Math.max(...rgb);
      const index = rgb.indexOf(max);
      rgb[index] = 0;
    }
    sum = this.sum(rgb);
    // const tolerance = 30;

    //if too close to some other color, make it different
    /*const existingColors = Object.entries<ColorObject>(this.dictColors).map(e => e[1]).sort((a,b) => a.sum - b.sum);
    const isClose = existingColors.find(c => Math.abs(c.sum - sum) <= tolerance);
    if(isClose) {
      for (let i = 0; i < existingColors.length; i++) {
        const color = existingColors[i];
        const previousSum = i== 0 ? 0 : existingColors[i-1].sum;
        if(color.sum - previousSum > 2*tolerance + 1) {
          sum = Math.floor((color.sum - previousSum)/2);
          this.setColor(rgb, sum, color);
          break;
        } else if(i == existingColors.length - 1) {
          sum = color.sum + tolerance +1;
          this.setColor(rgb, sum, color);
          break;
        }        
      }
    } */       

    const colorObj = {
      rgb: rgb, 
      sum: sum,
      color: `#${rgb[0].toString(16).padStart(2,'0')}${rgb[1].toString(16).padStart(2,'0')}${rgb[2].toString(16).padStart(2,'0')}`
    }
    this.dictColors[idSubmissionAnswer] = colorObj;

    return colorObj.color;          
  }

  setColor(dest: number[], sum: number, source: ColorObject) {
    const amountPerc = sum/source.sum;
    
    dest[0] = Math.floor(source.rgb[0]*amountPerc);
    dest[1] = Math.floor(source.rgb[1]*amountPerc);
    dest[2] = Math.floor(source.rgb[2]*amountPerc);    
  }

  sum(arr: number[]): number {
    return arr.reduce((a,b)=> a+b,0);
  }

}

export class VisualizerBlock {
  startTime: number;
  length: number;
  width: string;
  left: string;
  color: string;
  description;
  answer: SubmissionAnswer;
}

export class VisualizerData {
  submission: Submission;
  logInterval = 45;

  constructor(s: Submission) {
    this.submission = s;
  }
}

export class ColorObject {
  sum: number;
  color: string;
  rgb: number[];
}
