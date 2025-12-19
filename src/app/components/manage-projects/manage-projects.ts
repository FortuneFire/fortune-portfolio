import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PortfolioService, Project } from '../../services/portfolio.service';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-projects.html',
  styleUrls: ['./manage-projects.css']
})
export class ManageProjectsComponent implements OnInit {
  // Use the inject() function for all dependencies
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);

  @Output() editRequested = new EventEmitter<void>();

  projects: Project[] = [];

  ngOnInit(): void {
    // Get live data from Firestore
    this.portfolioService.getProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  onDelete(projectId: string | undefined): void {
    if (!projectId) return;
    
    if (confirm('Are you sure you want to delete this project?')) {
      this.portfolioService.deleteProject(projectId)
        .then(() => console.log('Project deleted'))
        .catch(err => console.error('Delete error:', err));
    }
  }

  onEdit(project: Project): void {
    // 1. Store the project in the service state
   
    this.portfolioService.setEditingProject(project);
    
    // 2. Tell the dashboard to switch to the form view
    this.editRequested.emit();
  }
}