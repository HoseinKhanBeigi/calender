import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { TimeSlotComponent } from './components/time-slot/time-slot.component';
import { TIME_SLOTS } from './components/time-slot/time-slots';
import { DraggableElementComponent } from './components/draggable-element/draggable-element.component';
import { NgForOf } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePickerComponent, TimeSlotComponent, NgForOf, RouterOutlet],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  timeSlots = TIME_SLOTS;
}
