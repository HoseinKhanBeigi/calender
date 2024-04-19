import {
  CdkDrag,
  CdkDragEnd,
  CdkDragPlaceholder,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';

import { ScheduleService } from '../../schedule.service';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragPlaceholder,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    AddAppointmentComponent,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit, OnChanges {
  startTime: any = 0;
  onEdit: Boolean = false;
  @Input() startTimeAppointment: any;
  @Input() endTimeAppointment: any;
  @Input() schedule: any;
  @Input() index: number | any;
  @ViewChild('elementToManipulate', { static: true })
  elementToManipulate: ElementRef | undefined;
  @ViewChild('dragHandleBottom', { static: true }) dragHandleBottom:
    | ElementRef
    | undefined;
  start: any;
  getBy15PixelStep: any;
  sumBy15PixelStep: any = 0;

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Access the nativeElement property to get access to the DOM element
    const element = this.elementToManipulate?.nativeElement;
    const dragHandleBottom = this.dragHandleBottom?.nativeElement;
    const [hours, minutes] = this.startTimeAppointment.split(':');
    this.startTime = this.convertPer15MinToQuarter(
      this.convertTimeToFloat(this.startTimeAppointment)
    );

    const [hoursEndTime, minutesEndTime] = this.endTimeAppointment.split(':');
    const totalMinutesStartTime =
      parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    const totalMinutesEndTime =
      parseInt(hoursEndTime, 10) * 60 + parseInt(minutesEndTime, 10);

    element.style.transform = `translateY(${
      totalMinutesStartTime + 15 + 15
    }px)`;
    element.style.height = `${totalMinutesEndTime - totalMinutesStartTime}px`;
    dragHandleBottom.style.top = `${
      totalMinutesEndTime - totalMinutesStartTime
    }px`;
  }
  get resizeBoxElement(): HTMLElement {
    return this.elementToManipulate?.nativeElement;
  }

  convertTimeToFloat(timeString: any) {
    const floatTime = parseFloat(timeString.replace(':', '.'));
    return floatTime;
  }

  ngOnChanges(changes: SimpleChanges) {
    const element = this.elementToManipulate?.nativeElement;
    const dragHandleBottom = this.dragHandleBottom?.nativeElement;

    if (this.onEdit) {
      element.style.transform = `translateY(${
        this.convertPer15MinToQuarter(
          this.convertTimeToFloat(this.startTimeAppointment)
        ) *
          60 +
        15 +
        15
      }px)`;
      this.sumBy15PixelStep = Math.round(
        this.convertTimeToFloat(this.startTimeAppointment) * 100
      );
      element.style.height = `${
        (this.convertPer15MinToQuarter(
          this.convertTimeToFloat(this.endTimeAppointment)
        ) -
          this.convertPer15MinToQuarter(
            this.convertTimeToFloat(this.startTimeAppointment)
          )) *
        60
      }px`;

      if (
        changes['startTimeAppointment']?.currentValue ||
        changes['endTimeAppointment']?.currentValue
      ) {
        const [hours, minutes] = this.startTimeAppointment.split(':');

        const [hoursEndTime, minutesEndTime] =
          this.endTimeAppointment.split(':');
        const totalMinutesStartTime =
          parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        const totalMinutesEndTime =
          parseInt(hoursEndTime, 10) * 60 + parseInt(minutesEndTime, 10);
        dragHandleBottom.style.top = `${
          totalMinutesEndTime - totalMinutesStartTime
        }px`;
      }
    }
  }
  dragMove(dragHandle: HTMLElement) {
    this.resize(dragHandle, this.resizeBoxElement);
    this.onEdit = false;
  }

  resize(dragHandle: HTMLElement, target: HTMLElement) {
    const dragRect = dragHandle.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const height = dragRect.top - targetRect.top + dragRect.height;
    target.style.height = Math.floor(height / 15) * 15 + 'px';

    if (target.style.height) {
      const appointmentHeight =
        this.startTime + parseInt(target.style.height, 10) / 60;
      const endTime = this.calculatePer15Min(appointmentHeight);
      const startTime = this.calculatePer15Min(this.startTime);
      this.updateSchedule(
        this.formatNumberToFixedDecimal(startTime),
        this.formatNumberToFixedDecimal(endTime)
      );
    }
  }

  roundToNearestQuarterHour() {
    this.sumBy15PixelStep = this.startTime * 60;
    this.sumBy15PixelStep += this.getBy15PixelStep.y;
    this.startTime = this.sumBy15PixelStep / 60;
    return this.calculatePer15Min(
      this.formatNumberToFixedDecimal(this.startTime)
    );
  }

  calculatePer15Min(decimalTime: any) {
    const hours = Math.floor(decimalTime);
    let minutes = decimalTime - hours;
    if (minutes === 0.25) {
      return hours + 0.15;
    } else if (minutes === 0.5) {
      return hours + 0.3;
    } else if (minutes === 0.75) {
      return hours + 0.45;
    } else {
      return hours;
    }
  }

  convertPer15MinToQuarter(decimalTime: any) {
    const hours = Math.floor(decimalTime);
    let minutes: any = decimalTime - hours;
    const convert: any = parseFloat(minutes).toFixed(2);
    if (convert == 0.15) {
      return hours + 0.25;
    } else if (convert == 0.3) {
      return hours + 0.5;
    } else if (convert == 0.45) {
      return hours + 0.75;
    } else {
      return hours;
    }
  }

  addMinutes(min1: any, min2: any) {
    let total = min1 + min2;
    let integerPart = Math.floor(total);
    let decimalPart = total - integerPart;
    let adjustedMinutes = Math.round(((decimalPart * 100) / 60) * 100) / 100;
    if (adjustedMinutes >= 1) {
      integerPart += Math.floor(adjustedMinutes);
      adjustedMinutes -= Math.floor(adjustedMinutes);
    }
    total = integerPart + adjustedMinutes;
    return total;
  }
  diffBetweenDecimalTime(decimalTime: any) {
    const hours = Math.floor(decimalTime);
    let minutes: any = decimalTime - hours;
    return parseFloat(minutes).toFixed(2);
  }

  formatNumberToFixedDecimal(num: any) {
    const fixedNum = num.toFixed(2);
    const parts = fixedNum.split('.');
    const paddedInt =
      parts[0].length < 2 ? parts[0].padStart(2, '0') : parts[0];
    return `${paddedInt}.${parts[1]}`;
  }

  dragEnded($event: CdkDragEnd) {
    const appointmentHeight =
      this.elementToManipulate?.nativeElement.getBoundingClientRect().height /
      60;

    const startTime = this.roundToNearestQuarterHour();
    const endTime = this.calculatePer15Min(
      this.addMinutes(startTime, this.calculatePer15Min(appointmentHeight))
    );

    this.updateSchedule(
      this.formatNumberToFixedDecimal(startTime),
      this.formatNumberToFixedDecimal(endTime)
    );
    this.onEdit = false;
  }

  dragStarted(event: CdkDragStart | any) {
    this.start = event.source.element.nativeElement.getBoundingClientRect();
  }

  computeDragRenderPos(pos: { y: number }) {
    const delta = pos.y - this?.start.y;
    this.getBy15PixelStep = {
      y: Math.floor(delta / 15) * 15,
    };
    return { y: this.start.y + Math.floor(delta / 15) * 15, x: this.start.x };
  }

  updateSchedule(startTime: any, endTime: any) {
    this.route.params.subscribe((params) => {
      const year = params['year'];
      const month = params['month'];
      const day = params['day'];
      const scheduleDate = new Date(`${year}-${month}-${day}`);

      const existingSchedulePerDay: any = {
        index: this.index,
        startTime,
        endTime,
        title: this.schedule.title,
      };

      this.scheduleService.updateScheduleById(
        scheduleDate,
        existingSchedulePerDay,
        this.schedule.id
      );
    });
  }
  deleteSchedule(scheduleId: string) {
    this.scheduleService.removeScheduleById(scheduleId);
  }

  onEditSchedule(schedule: any) {
    this.onEdit = true;
    this.route.params.subscribe((params) => {
      const year = params['year'];
      const month = params['month'];
      const day = params['day'];
      const scheduleDate = new Date(`${year}-${month}-${day}`);
      this.dialog.open(AddAppointmentComponent, {
        data: {
          date: scheduleDate,

          startTime: this.startTimeAppointment,
          endTime: this.endTimeAppointment,
          schedule,
        },
      });
    });
  }
}
