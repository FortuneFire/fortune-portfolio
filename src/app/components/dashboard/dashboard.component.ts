import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFormComponent } from '../projects-form/project-form.component';
import { ManageProjectsComponent } from '../manage-projects/manage-projects';
import { PortfolioService } from '../../services/portfolio.service';

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
  private portfolioService = inject(PortfolioService);

  // Default to showing the list
  showAddProject = false;
  showManageProjects = true;

  ngOnInit(): void { }

  toggleView(view: 'add' | 'manage'): void {
    if (view === 'add') {
      // If manually clicking "Add New", clear the editing state
      this.portfolioService.setEditingProject(null);
      this.showAddProject = true;
      this.showManageProjects = false;
    } else {
      this.showAddProject = false;
      this.showManageProjects = true;
    }
  }

  // This method handles the event from the Manage component
  handleEditRequest() {
    this.showAddProject = true;
    this.showManageProjects = false;
  }
}