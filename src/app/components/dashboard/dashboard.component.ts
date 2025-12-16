import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFormComponent } from '../projects/project-form.component';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProjectFormComponent,
    SignInComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
  }

}
