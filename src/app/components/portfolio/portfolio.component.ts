import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PortfolioService, Project } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
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

  @ViewChild('gallery', { static: false }) gallery!: ElementRef;

  // Lightbox state
  lightboxOpen = false;
  currentLightboxIndex = 0;
  selectedLightboxImage: string = '';

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.projects$.subscribe((projects: Project[]) => {
      this.projects = projects || [];
      this.filteredProjects = [...this.projects];

      // Extract unique categories
      this.project_categories = Array.from(
        new Set(this.projects.map(p => p.categories ?? []).flat())
      );

      // Add "All" as default filter
      this.project_filter_categories = ['All', ...this.project_categories];
    });
  }

  // ---------------- FILTER ----------------
  onCategoryClick(category: string): void {
    this.selectedFilter = category;
    this.filteredProjects =
      category === 'All'
        ? this.projects
        : this.projects.filter(p => (p.categories ?? []).includes(category));
  }

  // ---------------- CARD SELECTION ----------------
  onCardClick(project: Project): void {
    this.selectedCard = project;
  }

  backToCards(): void {
    this.selectedCard = null;
    this.closeLightbox();
  }

  // ---------------- GALLERY SCROLL ----------------
  scrollLeft(): void {
    this.gallery.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.gallery.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // ---------------- LIGHTBOX ----------------
  openLightbox(index: number): void {
    if (!this.selectedCard?.gallery?.length) return;
    this.currentLightboxIndex = index;
    this.selectedLightboxImage = this.selectedCard.gallery[index];
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  prevImage(): void {
    if (!this.selectedCard?.gallery?.length) return;
    this.currentLightboxIndex =
      (this.currentLightboxIndex - 1 + this.selectedCard.gallery.length) %
      this.selectedCard.gallery.length;
    this.selectedLightboxImage = this.selectedCard.gallery[this.currentLightboxIndex];
  }

  nextImage(): void {
    if (!this.selectedCard?.gallery?.length) return;
    this.currentLightboxIndex =
      (this.currentLightboxIndex + 1) % this.selectedCard.gallery.length;
    this.selectedLightboxImage = this.selectedCard.gallery[this.currentLightboxIndex];
  }
}
