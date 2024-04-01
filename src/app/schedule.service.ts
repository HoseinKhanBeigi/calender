import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ScheduleDate } from './schedule.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  // Initialize with an empty array
  private schedulesSubject = new BehaviorSubject<ScheduleDate[]>([]);

  // Method to add or update schedules
  addOrUpdateSchedule(newSchedule: ScheduleDate) {
    const currentValue = this.schedulesSubject.value;
    const existingDateIndex = currentValue.findIndex(
      (schedule) =>
        new Date(schedule.date).getTime() ===
        new Date(newSchedule.date).getTime()
    );

    if (existingDateIndex > -1) {
      // Date exists, update the schedules for that date
      const updatedSchedules = currentValue.map((schedule, index) => {
        if (index === existingDateIndex) {
          return {
            ...schedule,
            schedules: [...schedule.schedules, ...newSchedule.schedules],
          };
        }
        return schedule;
      });
      this.schedulesSubject.next(updatedSchedules);
    } else {
      // Date does not exist, add as a new entry
      const updatedSchedules = [...currentValue, newSchedule];
      this.schedulesSubject.next(updatedSchedules);
    }
  }

  private listScheuldesSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  listScheuldes$ = this.listScheuldesSubject.asObservable();
  listScheuldes = [
    {
      date: '',
      schedules: [
        { title: '', startTime: '', endTime: '' },
        { title: '', startTime: '', endTime: '' },
      ],
    },
  ];

  constructor(private router: ActivatedRoute) {}

  getSchedules() {
    return this.schedulesSubject.asObservable();
  }
  addSchedulePerDay(newSchedulPerDay?: any) {
    const findSchedule = this.listScheuldes.find(
      (findSchedule: any) =>
        new Date(findSchedule.date).getTime() ===
        new Date(newSchedulPerDay.date).getTime()
    );
    if (findSchedule) {
      findSchedule.schedules.push(...newSchedulPerDay.schedules);
    } else {
      this.listScheuldes.push(newSchedulPerDay);
    }
  }

  updateSchedulePerDay(updateSchedulPerDay: any, data: any) {
    const findSchedule = this.listScheuldes.find(
      (findSchedule: any) =>
        new Date(findSchedule.date).getTime() ===
        new Date(updateSchedulPerDay).getTime()
    );
    if (findSchedule) {
      findSchedule.schedules[data.numberIndex].startTime =
        data.startTime >= 10 ? `${data.startTime}:00` : `0${data.startTime}:00`;
      findSchedule.schedules[data.numberIndex].endTime =
        data.endTime >= 10 ? `${data.endTime}:00` : `0${data.endTime}:00`;
    }
  }

  getScheduleList() {
    return this.listScheuldes;
  }
}
