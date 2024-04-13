export interface Schedule {
  title: string;
  startTime: string | undefined;
  endTime: string;
  id?: string;
}

export interface ScheduleDate {
  date: string;
  schedules: Schedule[];
}
