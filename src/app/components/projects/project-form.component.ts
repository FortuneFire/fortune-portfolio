// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-project-form',
//   templateUrl: './project-form.component.html',
//   styleUrls: ['./project-form.component.css']
// })
// export class ProjectFormComponent implements OnInit {
//   projectForm!: FormGroup;
//   categories = ['Web Development', 'Web Design', 'Graphic Design'];
//   skills = ['Angular', 'CSS', 'HTML', 'JS', 'Bootstrap', 'AdobeXD'];
//   gallery: any[] = [];
//   isDraggingOver!: boolean;
//   http: any;

//   constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    
//    }

//   ngOnInit() {
//     this.projectForm = this.formBuilder.group({
//       title: '',
//       highlight: '',
//       description: '',
//       categories: this.formBuilder.array([]),
//       skills: this.formBuilder.array([]),
//       keyImage: null,
//       gallery: []
//     });
//     this.gallery = [];
//     this.addCheckboxes();
//   }

//   private addCheckboxes() {
//     this.categories.forEach(() => this.categoriesFormArray.push(this.formBuilder.control(false)));
//     this.skills.forEach(() => this.skillsFormArray.push(this.formBuilder.control(false)));
//   }

//   get categoriesFormArray() {
//     return this.projectForm.controls['categories'] as FormArray;
//   }

//   get skillsFormArray() {
//     return this.projectForm.controls['skills'] as FormArray;
//   }

//   onKeyImageSelected(event: any) {
//     if (event.target.files.length > 0) {
//       const file = event.target.files[0];
//       this.projectForm.patchValue({
//         keyImage: file
//       });
//     }
//   }
  
//   onGallerySelected(event: any) {
//     if (event.target.files.length > 0) {
//       const files = event.target.files;
//       for (let i = 0; i < files.length; i++) {
//         this.gallery.push(files[i]);
//       }
//       this.projectForm.patchValue({
//         gallery: this.gallery
//       });
//     }
//   }
  
  
//   onFileSelected(event: any) {
//     if (event.target.files.length > 0) {
//       const file = event.target.files[0];
//       this.projectForm.patchValue({
//         keyImage: file
//       });
//     }
//   }
  
//   onDragOver(event: any) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDraggingOver = true;
//   }
  
//   onDrop(event: any) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDraggingOver = false;
//     const files = event.dataTransfer.files;
//     if (files.length > 0) {
//       const file = files[0];
//       this.projectForm.patchValue({
//         keyImage: file
//       });
//     }
//   }
 

//   // onSubmit() {
//   //   const selectedCategories = this.categoriesFormArray.value
//   //     .map((checked: any, i: any) => checked ? this.categories[i] : null)
//   //     .filter((v: null) => v !== null);
//   //   const selectedSkills = this.skillsFormArray.value
//   //     .map((checked: any, i: any) => checked ? this.skills[i] : null)
//   //     .filter((v: null) => v !== null);

//   //   console.log({
//   //     title: this.projectForm.value.title,
//   //     highlight: this.projectForm.value.highlight,
//   //     description: this.projectForm.value.description,
//   //     categories: selectedCategories,
//   //     skills: selectedSkills
//   //   });
//   //   this.projectForm.reset();
//   // }

//   onSubmit() {
//     const selectedCategories = this.categoriesFormArray.value
//       .map((checked: any, i: any) => checked ? this.categories[i] : null)
//       .filter((v: null) => v !== null);
//     const selectedSkills = this.skillsFormArray.value
//       .map((checked: any, i: any) => checked ? this.skills[i] : null)
//       .filter((v: null) => v !== null);
  
//     const formData = new FormData();
//     formData.append('title', this.projectForm.value.title);
//     formData.append('highlight', this.projectForm.value.highlight);
//     formData.append('description', this.projectForm.value.description);
//     formData.append('categories', JSON.stringify(selectedCategories));
//     formData.append('skills', JSON.stringify(selectedSkills));
//     formData.append('keyImage', this.projectForm.value.keyImage);
  
//     for (let i = 0; i < this.projectForm.value.gallery.length; i++) {
//       formData.append('gallery', this.projectForm.value.gallery[i]);
//     }
 
//     // submit the form data to the server here
//     console.log(formData);
//    // make the HTTP request to the server
//    this.http.post('/api/projects', formData).subscribe(
//      (    response: any) => {
//       console.log('Success:', response);
//       // handle success response from server
//     },
//      (    error: any) => {
//       console.error('Error:', error);
//       // handle error response from server
//     }
//   );
//     // this.projectForm.reset();
//   }
  
  
// }


// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-project-form',
//   templateUrl: './project-form.component.html',
//   styleUrls: ['./project-form.component.css']
// })
// export class ProjectFormComponent implements OnInit {

//   projectForm!: FormGroup;
//   categories = ['Web Development', 'Web Design', 'Graphic Design'];
//   skills = ['Angular', 'CSS', 'HTML', 'JS', 'Bootstrap', 'AdobeXD'];

//   gallery: File[] = [];
//   isDraggingOver = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private http: HttpClient
//   ) {}

//   ngOnInit() {
//     this.projectForm = this.formBuilder.group({
//       title: '',
//       highlight: '',
//       description: '',
//       categories: this.formBuilder.array([]),
//       skills: this.formBuilder.array([]),
//       keyImage: null,
//       gallery: []
//     });

//     this.addCheckboxes();
//   }

//   private addCheckboxes() {
//     this.categories.forEach(() =>
//       this.categoriesFormArray.push(this.formBuilder.control(false))
//     );

//     this.skills.forEach(() =>
//       this.skillsFormArray.push(this.formBuilder.control(false))
//     );
//   }

//   get categoriesFormArray() {
//     return this.projectForm.controls['categories'] as FormArray;
//   }

//   get skillsFormArray() {
//     return this.projectForm.controls['skills'] as FormArray;
//   }

//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.projectForm.patchValue({ keyImage: file });
//     }
//   }

//   onGallerySelected(event: any) {
//     const files = event.target.files;
//     for (let i = 0; i < files.length; i++) {
//       this.gallery.push(files[i]);
//     }
//     this.projectForm.patchValue({ gallery: this.gallery });
//   }

//   onDragOver(event: any) {
//     event.preventDefault();
//     this.isDraggingOver = true;
//   }

//   onDrop(event: any) {
//     event.preventDefault();
//     this.isDraggingOver = false;

//     const file = event.dataTransfer.files[0];
//     if (file) {
//       this.projectForm.patchValue({ keyImage: file });
//     }
//   }

//   onSubmit() {
//     const selectedCategories = this.categoriesFormArray.value
//       .map((checked: any, i: number) => checked ? this.categories[i] : null)
//       .filter((v: any) => v !== null);

//     const selectedSkills = this.skillsFormArray.value
//       .map((checked: any, i: number) => checked ? this.skills[i] : null)
//       .filter((v: any) => v !== null);

//     const formData = new FormData();
//     formData.append('title', this.projectForm.value.title);
//     formData.append('highlight', this.projectForm.value.highlight);
//     formData.append('description', this.projectForm.value.description);
//     formData.append('categories', JSON.stringify(selectedCategories));
//     formData.append('skills', JSON.stringify(selectedSkills));

//     if (this.projectForm.value.keyImage) {
//       formData.append('keyImage', this.projectForm.value.keyImage);
//     }

//     this.gallery.forEach(file => {
//       formData.append('gallery', file);
//     });

//     this.http.post('/api/projects', formData).subscribe({
//       next: (res) => console.log('Success:', res),
//       error: (err) => console.error('Error:', err)
//     });
//   }
// }




import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PortfolioService, Project } from '../../services/portfolio.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  projectForm!: FormGroup;
  categories = ['Web Development', 'Web Design', 'Graphic Design'];
  skills = ['Angular', 'CSS', 'HTML', 'JS', 'Bootstrap', 'AdobeXD'];
  gallery: File[] = [];
  isDraggingOver = false;

  constructor(private fb: FormBuilder, private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      title: '',
      highlight: '',
      description: '',
      categories: this.fb.array([]),
      skills: this.fb.array([]),
      keyIMG: null,
      gallery: []
    });

    this.addCheckboxes();
  }

  private addCheckboxes() {
    this.categories.forEach(() => this.categoriesFormArray.push(this.fb.control(false)));
    this.skills.forEach(() => this.skillsFormArray.push(this.fb.control(false)));
  }

  get categoriesFormArray() {
    return this.projectForm.controls['categories'] as FormArray;
  }

  get skillsFormArray() {
    return this.projectForm.controls['skills'] as FormArray;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.projectForm.patchValue({ keyIMG: file });
  }

  onGallerySelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) this.gallery.push(files[i]);
    this.projectForm.patchValue({ gallery: this.gallery });
  }

  onDragOver(event: any) { event.preventDefault(); this.isDraggingOver = true; }

  onDrop(event: any) {
    event.preventDefault();
    this.isDraggingOver = false;
    const file = event.dataTransfer.files[0];
    if (file) this.projectForm.patchValue({ keyIMG: file });
  }

  onSubmit() {
    const selectedCategories = this.categoriesFormArray.value
      .map((checked: any, i: number) => checked ? this.categories[i] : null)
      .filter(v => v);

    const selectedSkills = this.skillsFormArray.value
      .map((checked: any, i: number) => checked ? this.skills[i] : null)
      .filter(v => v);

    const newProject: Project = {
      ...this.projectForm.value,
      categories: selectedCategories,
      skills: selectedSkills,
      id: 0, // service will assign
      gallery: [] // convert files to urls or handle as needed
    };

    this.portfolioService.addProject(newProject);
    this.projectForm.reset();
    this.gallery = [];
  }
}
