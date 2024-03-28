import { Component, EventEmitter, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { ScheduleService } from '../../schedule.service';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule],
})
export class DatePickerComponent {
  @Output() dataEvent = new EventEmitter<string>();
  selected: Date = new Date();

  constructor(
    private router: Router,
    private scheduleService: ScheduleService
  ) {}

  sendDataToParent(data: any) {
    this.dataEvent.emit(data);
  }

  onDateSelected(selectedDate: Date): void {
    const listScheulde = this.scheduleService.getScheduleList();
    const listSchedulePerDate = listScheulde.filter(
      (item) => new Date(item.date).getTime() === selectedDate.getTime()
    );
    this.sendDataToParent(listSchedulePerDate);
    const formattedDate = `${selectedDate.getFullYear()}/${
      selectedDate.getMonth() + 1
    }/${selectedDate.getDate()}`;

    this.router.navigate([formattedDate]);
  }
}
