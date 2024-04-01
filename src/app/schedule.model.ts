export interface Schedule {
  title: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleDate {
  date: string;
  schedules: Schedule[];
}
