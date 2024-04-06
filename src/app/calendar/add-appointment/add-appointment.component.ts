import { Component, Inject, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ScheduleService } from '../../schedule.service';
import { Schedule, ScheduleDate } from '../../schedule.model';

import { ReactiveFormsModule } from '@angular/forms';

import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
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
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,

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
      console.log(this.data);
      const existingSchedulePerDay: Schedule[] = [
        {
          title: this.appointmentForm.title,
          startTime: this.appointmentForm.startTime,
          endTime: this.appointmentForm.endTime,
        },
      ];
      this.scheduleService.addOrUpdateSchedule(
        `${this.data.date}`,
        existingSchedulePerDay
      );
      this.dialogRef.close();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
