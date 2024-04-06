import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { NgForOf } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgForOf, RouterOutlet],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
