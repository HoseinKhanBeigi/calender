import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { range } from 'rxjs';
import { map } from 'rxjs/operators';
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
      newSchedules.forEach((schedule) => {
        if (!schedule.id) {
          schedule.id = this.createScheduleId(date);
        }
      });
      schedules[dateIndex].schedules = [
        ...schedules[dateIndex].schedules,
        ...newSchedules,
      ];
    } else {
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

  updateScheduleById(scheduleDate: any, data: any, scheduleId: any) {
    const currentValue = this.schedulesSubject.value;
    const existingDate: any = currentValue.filter(
      (schedule) =>
        new Date(schedule.date).getTime() === new Date(scheduleDate).getTime()
    );
    if (existingDate) {
      const convertedStartedTime = data.startTime.toString().replace('.', ':');
      const convertedEndedTime = data.endTime.toString().replace('.', ':');

      existingDate[0].schedules.find(
        (schedule: any) => schedule.id === scheduleId
      ).startTime = convertedStartedTime;
      existingDate[0].schedules.find(
        (schedule: any) => schedule.id === scheduleId
      ).endTime = convertedEndedTime;
    }
  }

  generateTimeSequence = () => {
    return range(0, 96).pipe(
      map((index) => {
        const hour = Math.floor(index / 4);
        const minute = (index % 4) * 15;
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        return `${formattedHour}:${formattedMinute}`;
      })
    );
  };

  removeScheduleById(scheduleId: string) {
    const currentValue = this.schedulesSubject.value;
    const updatedValue = currentValue
      .map((scheduleDate) => ({
        ...scheduleDate,
        schedules: scheduleDate.schedules.filter(
          (schedule) => schedule.id !== scheduleId
        ),
      }))
      .filter((scheduleDate) => scheduleDate.schedules.length > 0);

    this.schedulesSubject.next(updatedValue);
  }
}
