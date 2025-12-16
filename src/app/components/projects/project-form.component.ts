import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../services/portfolio.service';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;

  categories: string[] = ['Web Development', 'Web Design', 'Graphic Design'];
  skills: string[] = ['Angular', 'CSS', 'HTML', 'JS', 'Bootstrap', 'AdobeXD'];

  gallery: File[] = [];
  isDraggingOver = false;

  constructor(private fb: FormBuilder, private portfolioService: PortfolioService) {}

  ngOnInit(): void {
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

  private addCheckboxes(): void {
    this.categories.forEach(() => this.categoriesFormArray.push(this.fb.control(false)));
    this.skills.forEach(() => this.skillsFormArray.push(this.fb.control(false)));
  }

  get categoriesFormArray(): FormArray {
    return this.projectForm.get('categories') as FormArray;
  }

  get skillsFormArray(): FormArray {
    return this.projectForm.get('skills') as FormArray;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.projectForm.patchValue({ keyIMG: input.files[0] });
  }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    for (let i = 0; i < input.files.length; i++) {
      this.gallery.push(input.files[i]);
    }
    this.projectForm.patchValue({ gallery: this.gallery });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = false;
    if (event.dataTransfer?.files.length) {
      this.projectForm.patchValue({ keyIMG: event.dataTransfer.files[0] });
    }
  }

  onSubmit(): void {
    const selectedCategories: string[] = this.categoriesFormArray.value
      .map((checked: boolean, i: number) => (checked ? this.categories[i] : null))
      .filter((v: string | null) => v !== null) as string[];

    const selectedSkills: string[] = this.skillsFormArray.value
      .map((checked: boolean, i: number) => (checked ? this.skills[i] : null))
      .filter((v: string | null) => v !== null) as string[];

    const newProject: Project = {
      ...this.projectForm.value,
      categories: selectedCategories,
      skills: selectedSkills,
      id: 0,
      gallery: []
    };

    this.portfolioService.addProject(newProject);

    this.projectForm.reset();
    this.gallery = [];
  }
}
