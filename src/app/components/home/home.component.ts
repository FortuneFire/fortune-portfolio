import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- import RouterModule
import { signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,MatButtonModule, MatIconModule], // <-- add RouterModule here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  buttons: string[] = [
    'Portfolio',
    'Git Hub',
    'My Blog',
    'Resume'
  ];

  showHidden = signal(false);

  toggleMenu() {
    this.showHidden.update(v => !v);
  }
}
