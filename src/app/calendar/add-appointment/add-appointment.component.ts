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
  times: string[] = [];
  constructor(
    private scheduleService: ScheduleService,
    public dialogRef: MatDialogRef<AddAppointmentComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.scheduleService.generateTimeSequence().subscribe((time) => {
      this.times.push(time);
    });

    this.appointmentForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
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
