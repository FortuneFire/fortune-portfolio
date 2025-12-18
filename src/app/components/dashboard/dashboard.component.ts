import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import the two main dashboard sub-components
import { ProjectFormComponent } from '../projects-form/project-form.component'; // Ensure path is correct
import { ManageProjectsComponent } from '../manage-projects/manage-projects'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProjectFormComponent,
    ManageProjectsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Logic to toggle between views
  showAddProject = true;
  showManageProjects = false;

  constructor() { }

  ngOnInit(): void { }

  // Quick methods to switch views
  toggleView(view: 'add' | 'manage'): void {
    this.showAddProject = (view === 'add');
    this.showManageProjects = (view === 'manage');
  }
}