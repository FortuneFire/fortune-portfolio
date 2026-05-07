import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  private auth = inject(Auth);
  private router = inject(Router);

  // AUTH STATE
  isLoggedIn$: Observable<boolean> = authState(this.auth).pipe(
    map(user => !!user)
  );

  // MOBILE NAV STATE
  mobileNavOpen = false;

  toggleMobileNav() {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  closeMobileNav() {
    this.mobileNavOpen = false;
  }

  // LOGOUT
  async logout() {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/']);
      this.closeMobileNav(); // close drawer after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}