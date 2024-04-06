export interface Schedule {
  title: string;
  startTime: string;
  endTime: string;
  id?: string;
}

export interface ScheduleDate {
  date: string;
  schedules: Schedule[];
}
