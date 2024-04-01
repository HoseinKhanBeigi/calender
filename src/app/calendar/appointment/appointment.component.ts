import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CdkDrag, CdkDragPlaceholder],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit, OnChanges {
  @Input() startTime: number = 0;
  @Input() schedule: any;
  @ViewChild('elementToManipulate', { static: true })
  elementToManipulate: ElementRef | undefined;

  ngOnInit(): void {
    // Access the nativeElement property to get access to the DOM element
    const element = this.elementToManipulate?.nativeElement;
    let startTime = parseInt(this.schedule.startTime.split(':')[0], 10);
    let endTime = parseInt(this.schedule.endTime.split(':')[0], 10);
    element.style.transform = `translateY(${startTime * 60}px)`;
    element.style.height = `${(endTime - startTime) * 60}px`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startTime'].currentValue) {
      const element = this.elementToManipulate?.nativeElement;
      element.style.transform = `translateY(${this.startTime * 60}px)`;
      element.style.height = `${60}px`;
    }
  }
}
