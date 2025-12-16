import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- import RouterModule

@Component({
  selector: 'app-header',
  standalone: true,               // make it standalone
  imports: [CommonModule, RouterModule], // <-- add RouterModule here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn = false;

  constructor() { }

  ngOnInit(): void {
    // You can initialize login status here if needed
  }

}
