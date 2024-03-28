import { NgForOf } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DraggableElementComponent } from '../draggable-element/draggable-element.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { TIME_SLOTS } from './time-slots';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleService } from '../../schedule.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-time-slot',
  standalone: true,
  imports: [
    NgForOf,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    DraggableElementComponent,
    DatePickerComponent,
    MatButtonModule,
  ],
  templateUrl: './time-slot.component.html',
  styleUrl: './time-slot.component.scss',
})
export class TimeSlotComponent {
  timeSlots = TIME_SLOTS;
  numberIndex = 0;
  listScheduleTime: any;
  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getListSchedulePerDate(data: any) {
    if (data.length > 0) {
      this.listScheduleTime = data[0].schedules;
    } else {
      this.listScheduleTime = [];
    }
  }

  updateSchedulePerDate(data: any) {
    const url = window.location.href;
    let updateSchedulPerDay: any;
    const regex = /(\d{4})\/(\d{1,2})\/(\d{1,2})/;
    const matches = url.match(regex);
    if (matches && matches.length === 4) {
      const year = matches[1];
      const month = matches[2];
      const day = matches[3];

      updateSchedulPerDay = new Date(`${year}-${month}-${day}`);
    }
    this.scheduleService.updateSchedulePerDay(updateSchedulPerDay, data);
    const findSchedule: any = this.scheduleService
      .getScheduleList()
      .find(
        (findSchedule: any) =>
          new Date(findSchedule.date).getTime() ===
          new Date(updateSchedulPerDay).getTime()
      );
    this.listScheduleTime = findSchedule.schedules;
  }

  handleClick(): void {
    this.dialog.open(AppointmentFormComponent);
  }
}
