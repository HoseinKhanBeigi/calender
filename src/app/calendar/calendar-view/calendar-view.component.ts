import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TIME_SLOTS } from './time-slots';
import { DraggableComponent } from '../draggable/draggable.component';
import { AppointmentComponent } from '../appointment/appointment.component';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ScheduleService } from '../../schedule.service';
import { Schedule } from '../../schedule.model';
import { NgForOf, NgStyle } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragPlaceholder,
    CdkDropList,
    AppointmentComponent,
    AddAppointmentComponent,
    DatePickerComponent,
    DraggableComponent,
    NgForOf,
    MatButtonModule,
    NgStyle,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent {
  timeSlots = TIME_SLOTS;
  schedules: Schedule[] = [];
  startTime: number = 0;
  @ViewChild('myList') myList: ElementRef | undefined;
  date: Date | undefined;
  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('...هدفم خیره\n', '...نیتم خیره\n', '...برای امر خیره\n');
    this.scheduleService.getSchedules().subscribe((schedules) => {
      this.route.params.subscribe((params) => {
        const year = params['year'];
        const month = params['month'];
        const day = params['day'];
        this.date = new Date(`${year}-${month}-${day}`);
        const existingDateIndex = schedules.filter(
          (schedule) =>
            new Date(schedule.date).getTime() ===
            new Date(`${year}-${month}-${day}`).getTime()
        );

        this.schedules =
          existingDateIndex.length > 0 ? existingDateIndex[0].schedules : [];
      });
    });
  }

  drop(event: any) {
    console.log('hiii....');
  }
  onDragStart(event: DragEvent) {
    // Transfer the data: the draggable element's ID
    event?.dataTransfer?.setData('text/plain', (event.target as Element).id);
  }

  onDragOver(event: DragEvent) {
    console.log('log...');

    // event.preventDefault(); // Necessary to allow the drop
    // You can do other things here, such as changing the style to indicate a drag is over this area
  }

  onDrop(event: DragEvent) {
    console.log('log...');
    // event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    // const data = event.dataTransfer.getData('text');
    // console.log('Dropped data:', data);
    // You can handle the dropped data here
  }
  addAppointment() {}

  calculateTop(index: number): string {
    return `${15 * (index + 1)}px`; // Each line is 15px more than the previous
  }

  handleClick() {
    this.dialog.open(AddAppointmentComponent, {
      data: { date: this.date },
    });
  }
}
