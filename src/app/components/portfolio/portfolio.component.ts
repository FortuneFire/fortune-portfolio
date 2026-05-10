import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../services/portfolio.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgForOf, NgIf],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  selectedCard: Project | null = null;
  selectedFilter = 'All';

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  project_filter_categories: string[] = [];

  @ViewChild('gallery') gallery!: ElementRef;

  lightboxOpen = false;
  currentLightboxIndex = 0;
  selectedLightboxImage = '';

  constructor(
  private portfolioService: PortfolioService,
  private sanitizer: DomSanitizer
) {}

  ngOnInit(): void {
    // Live subscription to your 'projects' collection
    this.portfolioService.getProjects().subscribe({
      next: (projects) => {
        
        this.projects = projects;
        
        // Sync filtered list with new incoming data
        this.applyFilter();

        // Dynamically extract categories for filter tabs
        const categories = projects.flatMap(p => p.categories ?? []);
        this.project_filter_categories = [
          'All',
          ...Array.from(new Set(categories))
        ];
      },
      error: (err) => console.error('❌ Firestore error:', err)
    });
  }

  onCategoryClick(category: string): void {
    this.selectedFilter = category;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredProjects = this.selectedFilter === 'All'
      ? this.projects
      : this.projects.filter(p => (p.categories ?? []).includes(this.selectedFilter));
  }

  onCardClick(project: Project): void {
    this.selectedCard = project;
  }

  backToCards(): void {
    this.selectedCard = null;
    this.closeLightbox();
  }

  // --- GALLERY AND LIGHTBOX LOGIC ---

  scrollLeft(): void {
    this.gallery?.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.gallery?.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

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

  renderMarkdown(text: string | undefined): SafeHtml {
  if (!text) return '';
   const html: string = marked.parse(text, { async: false }); 

  return this.sanitizer.bypassSecurityTrustHtml(html);
}

showBackButton = true; // Temporarily always visible for debugging

@HostListener('window:scroll', [])
onWindowScroll(): void {
  const scrollY =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  // Only show back button when a project is selected AND user has scrolled
  this.showBackButton = this.selectedCard !== null && scrollY > 250;
}

}


