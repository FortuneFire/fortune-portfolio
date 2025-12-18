import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
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
  
  // Maps the authState to a simple true/false boolean
  isLoggedIn$: Observable<boolean> = authState(this.auth).pipe(
    map(user => !!user)
  );
}