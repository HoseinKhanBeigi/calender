import { Component, Inject, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ScheduleService } from '../../schedule.service';
import { Schedule, ScheduleDate } from '../../schedule.model';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
  selectedStartTime: any;
  selectedStartEndTime: any;
  times: string[] = [];
  constructor(
    private scheduleService: ScheduleService,

    public dialogRef: MatDialogRef<AddAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {}

  formatNumberToFixedDecimal(num: number) {
    // Convert the number to a float with two decimal places
    const formattedNumber = num.toFixed(2); // This converts the number to a string
    return formattedNumber; // Convert it back to a number if necessary
  }

  ngOnInit(): void {
    this.scheduleService.generateTimeSequence().subscribe((time) => {
      this.times.push(time);
    });

    this.appointmentForm = this.formBuilder.group(
      {
        title: [
          this.data.schedule ? this.data.schedule.title : '',
          Validators.required,
        ],
        startTime: [
          this.data.startTime ? this.data.startTime : '',
          Validators.required,
        ],
        endTime: [
          this.data.endTime ? this.data.endTime : '',
          Validators.required,
        ],
        // Add more form controls as needed
      },
      { validator: this.timeValidator }
    );
  }

  timeValidator(form: FormGroup) {
    const startTime = form.get('startTime')?.value;
    const endTime = form.get('endTime')?.value;

    if (startTime && endTime && endTime <= startTime) {
      return { timeInvalid: true };
    }
    return null;
  }

  selectedDateTime: any;

  selectedTime: string | undefined;
  selectedTime2: string | undefined;

  submitForm() {
    if (this.appointmentForm.valid) {
      const existingSchedulePerDay: Schedule[] = [
        {
          title: this.appointmentForm.value.title,
          startTime: this.appointmentForm.value.startTime,
          endTime: this.appointmentForm.value.endTime,
        },
      ];

      if (this.data.schedule) {
        this.scheduleService.updateScheduleById(
          this.data.date,
          existingSchedulePerDay[0],
          this.data.schedule.id
        );
      } else {
        this.scheduleService.addOrUpdateSchedule(
          `${this.data.date}`,
          existingSchedulePerDay
        );
      }

      this.dialogRef.close();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
