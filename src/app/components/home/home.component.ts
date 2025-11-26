import { Component } from '@angular/core';



@Component({
  selector: 'app-home',
  // standalone: true,
  // imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  buttons = [
    "Portfolio",
    "Git Hub",
    "My Blog"
  ];
}
