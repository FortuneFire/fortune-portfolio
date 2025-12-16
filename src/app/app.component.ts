// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component'; // import your header

@Component({
  selector: 'app-root',
  standalone: true, // mark as standalone
  imports: [HeaderComponent, RouterOutlet], // import any components/directives used in the template
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fortune-portfolio';
}




// src/app/app.component.ts
// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HeaderComponent } from './components/header/header.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     BrowserAnimationsModule,
//     HeaderComponent
//   ],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'fortune-portfolio';
// }
