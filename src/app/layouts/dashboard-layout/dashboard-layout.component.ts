import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnDestroy {

  private readonly document = inject(DOCUMENT);

  isSidebarOpen = false;

  openSidebar(): void {
    this.isSidebarOpen = true;
    // Stop the page behind the drawer from scrolling
    this.document.body.style.overflow = 'hidden';
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    this.document.body.style.overflow = '';
  }

  // Escape closes the drawer
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  // If the window grows past the mobile breakpoint, reset the drawer
  @HostListener('window:resize')
  onResize(): void {
    if (this.isSidebarOpen && window.innerWidth > 900) {
      this.closeSidebar();
    }
  }

  // Never leave the page locked if the layout is destroyed while open
  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
  }

}