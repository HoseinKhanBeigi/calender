import {
  CdkDrag,
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
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit, OnChanges {
  @Input() startTime: any = 0;
  @Input() schedule: any;
  @Input() index: number | any;
  @ViewChild('elementToManipulate', { static: true })
  elementToManipulate: ElementRef | undefined;
  @ViewChild('dragHandleBottom', { static: true }) dragHandleBottom:
    | ElementRef
    | undefined;
  start: any;

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Access the nativeElement property to get access to the DOM element
    const element = this.elementToManipulate?.nativeElement;
    const dragHandleBottom = this.dragHandleBottom?.nativeElement;
    // console.log(parseInt(this.schedule.startTime.split(':')[0], 10));
    // console.log(this.schedule.endTime, this.schedule.startTime);

    // Split the string by the '.' to separate hours and minutes
    const [hours, minutes] = this.schedule.startTime.split(':');
    console.log(this.schedule);
    // Convert the hours to a number and multiply by 60, convert minutes to a number as well
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    // console.log(totalMinutes);

    let startTime = parseInt(this.schedule.startTime.split(':')[0], 10);
    let endTime = parseInt(this.schedule.endTime.split(':')[0], 10);
    element.style.transform = `translateY(${startTime * 60 + 15 + 15}px)`;
    element.style.height = `${(endTime - startTime) * 60}px`;
    dragHandleBottom.style.top = `${(endTime - startTime) * 60}px`;
  }
  get resizeBoxElement(): HTMLElement {
    return this.elementToManipulate?.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startTime'].currentValue) {
      const element = this.elementToManipulate?.nativeElement;
      element.style.transform = `translateY(${this.startTime * 60}px)`;
      element.style.height = `${60}px`;
    }
  }
  dragMove(dragHandle: HTMLElement) {
    this.resize(dragHandle, this.resizeBoxElement);
  }

  resize(dragHandle: HTMLElement, target: HTMLElement) {
    const dragRect = dragHandle.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const height = dragRect.top - targetRect.top + dragRect.height;
    target.style.height = Math.floor(height / 15) * 15 + 'px';
    if (target.style.height) {
      let startTime = parseInt(this.schedule.startTime.split(':')[0], 10);
      const endTime: any = target.style.height;
      const res: any = parseInt(endTime, 10);
      // console.log(this.schedule.startTime);
      // console.log(res);

      // this.startTime = parseInt(this.schedule.startTime.split(':')[0], 10);
    }
    // this.updateSchedule();
  }

  roundToNearestQuarterHour(decimalTime: any) {
    // Extract hours and minutes from the decimal time
    let hours = Math.floor(decimalTime);

    let minutes = decimalTime - hours;
    if (minutes > 0.01 && minutes < 0.24) {
      return hours + 0.15;
    } else if (minutes > 0.24 && minutes < 0.5) {
      return hours + 0.3;
    } else if (minutes > 0.5 && minutes < 0.76) {
      return hours + 0.45;
    } else {
      return Math.ceil(decimalTime);
    }
  }

  dragEnded(event: CdkDragStart | any) {
    this.startTime = this.roundToNearestQuarterHour(event.event.pageY / 60);

    if (this.startTime) {
      this.updateSchedule();
    }
  }

  dragStarted(event: CdkDragStart | any) {
    this.start = event.source.element.nativeElement.getBoundingClientRect();
  }

  computeDragRenderPos(pos: { y: number }) {
    const delta = pos.y - this?.start.y;
    return { y: this.start.y + Math.floor(delta / 15) * 15, x: this.start.x };
  }

  updateSchedule() {
    const element =
      this.elementToManipulate?.nativeElement.getBoundingClientRect().height;
    this.route.params.subscribe((params) => {
      const year = params['year'];
      const month = params['month'];
      const day = params['day'];
      const scheduleDate = new Date(`${year}-${month}-${day}`);
      const result: any = parseFloat(
        (this.startTime - element / 60).toFixed(2)
      );
      const resultForStartTime = parseFloat(
        (result + element / 60 - 1).toFixed(2)
      );

      const roundForEndTime: any = parseFloat(
        this.startTime + element / 60
      ).toFixed(2);

      const existingSchedulePerDay: any = {
        startTime: element === 60 ? result : resultForStartTime,
        endTime:
          element === 60
            ? this.startTime
            : parseFloat((roundForEndTime - 1).toFixed(2)),
        index: this.index,
      };
      // console.log(existingSchedulePerDay);
      this.scheduleService.updateScheduleById(
        scheduleDate,
        existingSchedulePerDay
      );
    });
  }
  deleteSchedule(scheduleId: string) {
    this.scheduleService.removeScheduleById(scheduleId);
  }
}
