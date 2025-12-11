import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface numberIndex {
  cols: (number | null)[];
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css'
})
export class DynamicTableComponent implements OnInit {

  // Timer
  timerStarted = false;
  timer = 0;
  private interval: any = null;

  // Speed control
  speed = 1000; // ms (slowest)
  knobAngle = 0; // 0–270°
  private isDragging = false;
  ticks = Array(20).fill(0);
speedColor = '#4a90e2'; // default blue


  headings: string[] = ['1', '2', '3', '4', '5'];
  inputs: any[] = ['', '', '', '', ''];

  data: numberIndex[] = [];

  ngOnInit(): void {
    // create 4 empty rows
    for (let i = 0; i < 4; i++) {
      this.data.push({
        cols: [null, null, null, null, null]
      });
    }
  }

  // ----------------------------
  // TIMER
  // ----------------------------
  startTimer() {
    if (this.timerStarted) return;

    this.timerStarted = true;
    this.timer = 0;

    this.interval = setInterval(() => {
      this.timer += 1;
      this.decreaseValues();
    }, this.speed);
  }

  // SPEED KNOB LOGIC
  startKnobDrag(event: MouseEvent) {
    this.isDragging = true;

    const moveHandler = (e: MouseEvent) => {
      if (!this.isDragging) return;

      const knob = (event.target as HTMLElement).getBoundingClientRect();
      const centerX = knob.left + knob.width / 2;
      const centerY = knob.top + knob.height / 2;

      const angle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

      let fixedAngle = angle + 90;
      if (fixedAngle < 0) fixedAngle += 360;

      // Lock to 0–270 degrees
      fixedAngle = Math.min(Math.max(fixedAngle, 0), 270);

      this.knobAngle = fixedAngle;
      this.updateSpeedFromAngle();
    };

    const stopHandler = () => {
      this.isDragging = false;
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', stopHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', stopHandler);
  }

  updateSpeedFromAngle() {
  const minSpeed = 200;  
  const maxSpeed = 1000; 
  const ratio = this.knobAngle / 270;

  this.speed = maxSpeed - ratio * (maxSpeed - minSpeed);

  // Color changes with speed: blue → purple → red
  const r = Math.round(70 + ratio * 180);
  const g = Math.round(130 - ratio * 80);
  const b = Math.round(226 - ratio * 200);

  this.speedColor = `rgb(${r}, ${g}, ${b})`;

  // Restart timing interval
  clearInterval(this.interval);
  this.interval = setInterval(() => {
    this.timer += 1;
    this.decreaseValues();
  }, this.speed);
}


  // ----------------------------
  // ADD VALUES
  // ----------------------------
  add(colIndex: number, value: number) {
    if (value < 0) return;

    this.startTimer();

    // Insert into first empty row
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].cols[colIndex] === null) {
        this.data[i].cols[colIndex] = value;
        this.inputs[colIndex] = '';
        return;
      }
    }

    // If no empty row → add to lowest value
    let lowestValue = Infinity;
    let index = -1;

    for (let i = 0; i < this.data.length; i++) {
      const cell = this.data[i].cols[colIndex];
      if (cell !== null && cell < lowestValue) {
        lowestValue = cell;
        index = i;
      }
    }

    this.data[index].cols[colIndex] = lowestValue + value;
    this.inputs[colIndex] = '';
  }

  // VALUE DECREASING LOGIC
  private decreaseValues() {
    for (let r = 0; r < this.data.length; r++) {
      for (let c = 0; c < this.data[r].cols.length; c++) {
        let val = this.data[r].cols[c];
        if (val !== null) {
          val--;
          this.data[r].cols[c] = val > 0 ? val : null;
        }
      }
    }
  }

  // ----------------------------
  // ONLY SHOW ROWS WITH VALUES
  // ----------------------------
  get visibleRows() {
    return this.data.filter(row => row.cols.some(c => c !== null));
  }
}
