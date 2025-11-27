



import { Component, OnInit } from '@angular/core';
import { PortfolioService, Project } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  selectedCard: Project | null = null;
  selectedFilter = 'All';

  projects: Project[] = [];
  filteredProjects: Project[] = [];

  project_categories: string[] = [];
  project_filter_categories: string[] = [];

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    // Subscribe to projects from the service
    this.portfolioService.projects$.subscribe((projects: Project[]) => {
      this.projects = projects || [];
      this.filteredProjects = [...this.projects];

      // Dynamically map all unique categories
      this.project_categories = Array.from(
        new Set(
          this.projects
            .map(project => project.categories ?? [])
            .flat()
        )
      );



      // Add "All" as default filter
      this.project_filter_categories = ['All', ...this.project_categories];
    });
  }

  onCategoryClick(category: string): void {
    this.selectedFilter = category;

    this.filteredProjects = 
      category === 'All' 
        ? this.projects 
        : this.projects.filter(p => (p.categories ?? []).includes(category));
  }


 

  onCardClick(project: Project): void {
    this.selectedCard = project;
  }

  backToCards(): void {
    this.selectedCard = null;
  }
}



