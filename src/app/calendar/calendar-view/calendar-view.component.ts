import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TIME_SLOTS } from './time-slots';
import { AppointmentComponent } from '../appointment/appointment.component';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ScheduleService } from '../../schedule.service';
import { ScheduleDate } from '../../schedule.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [AppointmentComponent, AddAppointmentComponent, DatePickerComponent],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent implements OnInit {
  timeSlots = TIME_SLOTS;
  schedules: ScheduleDate[] = [];
  startTime: number = 0;
  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.scheduleService.getSchedules().subscribe((schedules) => {
      this.schedules = schedules;
    });

    // this.route.params.subscribe((params) => {
    //   console.log(params);
    //   const year = params['year'];
    //   console.log(year);
    //   // Use the id for whatever you need, like fetching data
    // });
  }

  updateSchedulePerDate(date: any) {}

  handleClick(e: any) {
    this.startTime = Math.floor(e.pageY / 60);
    this.dialog.open(AddAppointmentComponent);
  }
}
