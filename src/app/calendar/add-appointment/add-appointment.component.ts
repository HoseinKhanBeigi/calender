import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ScheduleService } from '../../schedule.service';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogContent,
    FormsModule,
    NgFor,
    MatButtonModule,
    MatSelectModule,
    MatDialogActions,
    NgIf,
    MatDialogClose,
  ],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent {
  // myForm: FormGroup ;
  appointmentForm: FormGroup | any;
  constructor(
    private scheduleService: ScheduleService,
    public dialogRef: MatDialogRef<AddAppointmentComponent>,

    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.formBuilder.group({
      title: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      // Add more form controls as needed
    });
  }

  selectedDateTime: any;

  selectedTime: string | undefined;
  selectedTime2: string | undefined;
  times: string[] = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  submitForm() {
    if (this.appointmentForm.valid) {
      const url = window.location.href;
      const regex = /(\d{4})\/(\d{1,2})\/(\d{1,2})/;
      const matches = url.match(regex);
      if (matches && matches.length === 4) {
        const year = matches[1];
        const month = matches[2];
        const day = matches[3];
        this.appointmentForm.date = new Date(`${year}-${month}-${day}`);
      }

      const existingSchedulePerDay = {
        date: this.appointmentForm.date,
        schedules: [
          {
            title: this.appointmentForm.title,
            startTime: this.appointmentForm.startTime,
            endTime: this.appointmentForm.endTime,
          },
        ],
      };

      this.scheduleService.addOrUpdateSchedule(existingSchedulePerDay);
      this.dialogRef.close();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
