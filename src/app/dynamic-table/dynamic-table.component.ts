import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface numberIndex{
  cols: (number | null)[];
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css'
})
export class DynamicTableComponent implements OnInit {
    // Timer display
  timerStarted = false;
  timer = 0;
  private interval: any = null;

  // time start when first input happens
  startTimer() {
    if (this.timerStarted) return;

    this.timerStarted = true;
    this.timer = 0;
    this.interval = setInterval(() => {
      this.timer += 1;    
      this.decreaseValues();
    }, 1000);
  }

  headings: string[] = [' 1', ' 2', ' 3', ' 4', ' 5'];

  // this is for input
  input0 = '';
  input1 = '';
  input2 = '';
  input3 = '';
  input4 = '';
  //
  data: numberIndex[] = [];

  ngOnInit(): void {
    
    // create 4 empty rows
    for (let i = 0; i < 4; i++) {
      this.data.push({
        cols:[null,null,null,null,null]
      });
    }
  }

  add(colIndex: number, value: number) {
    if(value<1)return;
    this.startTimer();  
    // insert values
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].cols[colIndex] === null) {
        this.data[i].cols[colIndex] = value;
      return;
      }
    }
    // adding value in lowest no.
    let lowestvalue = Infinity;
    let index = -1;
    for (let i = 0; i < this.data.length; i++) {
      const cell = this.data[i].cols[colIndex];
      if (cell !== null && cell < lowestvalue) {
        lowestvalue = cell;
        index = i;
      }
    } 
      this.data[index].cols[colIndex] = value; 
  }
   
    // decrease value in each cell
  private decreaseValues() {
    for (let r = 0; r < this.data.length; r++) {
      for (let c = 0; c < this.data[r].cols.length; c++) {
        let val = this.data[r].cols[c];
        if (val !== null) {
          val--;
          this.data[r].cols[c] = val>0?val:null;
        }
     }
   }
 }


}

