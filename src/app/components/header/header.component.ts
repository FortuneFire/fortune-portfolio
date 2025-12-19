import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Added Router here
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
  private router = inject(Router); // This works now with the import above
  
  // Maps the authState to a simple true/false boolean
  isLoggedIn$: Observable<boolean> = authState(this.auth).pipe(
    map(user => !!user)
  );

  async logout() {
    try {
      await signOut(this.auth);
      // Redirects to home page so logged-out users can't stay on the dashboard
      await this.router.navigate(['/']); 
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}