import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Schedule, ScheduleDate } from './schedule.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  // Initialize with an empty array
  private schedulesSubject = new BehaviorSubject<ScheduleDate[]>([]);

  private createScheduleId(date: string): string {
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${date.replace(/-/g, '')}-${Date.now()}-${randomPart}`;
  }

  addOrUpdateSchedule(date: string, newSchedules: Schedule[]) {
    let schedules = this.schedulesSubject.value;
    const dateIndex = schedules.findIndex(
      (sd) => new Date(sd.date).getTime() === new Date(date).getTime()
    );

    if (dateIndex > -1) {
      // Date exists, update schedules for that date
      newSchedules.forEach((schedule) => {
        if (!schedule.id) {
          // Assign an ID if the schedule is new
          schedule.id = this.createScheduleId(date);
        }
      });
      schedules[dateIndex].schedules = [
        ...schedules[dateIndex].schedules,
        ...newSchedules,
      ];
    } else {
      // Date does not exist, add as a new entry with IDs for each schedule
      newSchedules = newSchedules.map((schedule) => ({
        ...schedule,
        id: schedule.id || this.createScheduleId(date),
      }));
      schedules = [...schedules, { date, schedules: newSchedules }];
    }

    this.schedulesSubject.next(schedules);
  }

  getSchedules() {
    return this.schedulesSubject.asObservable();
  }

  updateScheduleById(scheduleDate: any, data: any) {
    const currentValue = this.schedulesSubject.value;
    const existingDate = currentValue.find(
      (schedule) =>
        new Date(schedule.date).getTime() === new Date(scheduleDate).getTime()
    );
    if (existingDate) {
      existingDate.schedules[data.index].startTime =
        data.startTime >= 10 ? `${data.startTime}:00` : `0${data.startTime}:00`;
      existingDate.schedules[data.index].endTime =
        data.endTime >= 10 ? `${data.endTime}:00` : `0${data.endTime}:00`;
    }
  }

  removeScheduleById(scheduleId: string) {
    const currentValue = this.schedulesSubject.value;

    // Iterate over each date
    const updatedValue = currentValue
      .map((scheduleDate) => ({
        ...scheduleDate,
        // Filter out the schedule with the matching ID
        schedules: scheduleDate.schedules.filter(
          (schedule) => schedule.id !== scheduleId
        ),
      }))
      .filter((scheduleDate) => scheduleDate.schedules.length > 0); // Optionally, remove dates with no schedules left

    this.schedulesSubject.next(updatedValue);
  }
}
