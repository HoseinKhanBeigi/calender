import {
  AfterRenderRef,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TIME_SLOTS } from './time-slots';
import { AppointmentComponent } from '../appointment/appointment.component';
import { CanvasDragDropComponent } from '../canvas-drag-drop/canvas-drag-drop.component';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ScheduleService } from '../../schedule.service';
import { Schedule } from '../../schedule.model';
import { NgForOf } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragPlaceholder,
    CdkDropList,
    CanvasDragDropComponent,
    AppointmentComponent,
    AddAppointmentComponent,
    DatePickerComponent,
    NgForOf,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent implements AfterViewInit {
  timeSlots = TIME_SLOTS;
  schedules: Schedule[] = [];
  startTime: number = 0;

  @ViewChild('myList') myList: ElementRef | undefined;
  @ViewChildren('listItem') listItems: QueryList<ElementRef> | undefined;
  date: Date | undefined;
  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('...هدفم خیره\n', '...نیتم خیره\n', '...برای امر خیره\n');

    // const element = this.slotTimeLine?.nativeElement;
    // console.log(element.children);

    // [...element.children].addEventListener('dragleave', () => {
    //   console.log('hi...');
    //   // You might want to set some data here
    //   // e.dataTransfer.setData('text/plain', 'This text may be dragged');
    // });

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
  ngAfterViewInit() {
    this.myList?.nativeElement.children[0].addEventListener('', () => {
      console.log('hi...');
      // You might want to set some data here
      // e.dataTransfer.setData('text/plain', 'This text may be dragged');
    });
  }

  drop(event: CdkDragDrop<string[]>) {}

  onDragEnter(event: any, time: any) {}

  onDragExit(event: any, slot: any) {
    // Optional: Action when the draggable element leaves the drop zone
  }

  onDragStart(event: DragEvent) {}

  handleClick(e: any) {
    // this.startTime = Math.floor(e.pageY / 60);
    this.dialog.open(AddAppointmentComponent, {
      data: { date: this.date },
    });
  }
}
