import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
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
