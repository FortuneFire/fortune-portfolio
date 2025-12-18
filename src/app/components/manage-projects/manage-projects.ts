import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../services/portfolio.service';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-projects.html',
  styleUrls: ['./manage-projects.css']
})
export class ManageProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(private portfolioService: PortfolioService) {}

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
}