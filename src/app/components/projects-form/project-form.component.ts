import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../services/portfolio.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);

  projectForm!: FormGroup;
  categories: string[] = ['Web Development', 'Web Design', 'Graphic Design'];
  skills: string[] = ['Angular', 'CSS', 'HTML', 'JS', 'Firebase'];
  
  isDraggingOver = false;

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      highlight: ['', Validators.required],
      description: ['', Validators.required],
      categories: this.fb.array([]),
      skills: this.fb.array([]),
      keyIMG: [null],
      gallery: [[]]
    });

    this.addCheckboxes();
  }

  // --- FormArray Helpers ---
  private addCheckboxes(): void {
    this.categories.forEach(() => this.categoriesFormArray.push(this.fb.control(false)));
    this.skills.forEach(() => this.skillsFormArray.push(this.fb.control(false)));
  }

  get categoriesFormArray() { return this.projectForm.get('categories') as FormArray; }
  get skillsFormArray() { return this.projectForm.get('skills') as FormArray; }

  // --- Image Handling (Placeholder logic) ---
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.projectForm.patchValue({ keyIMG: file });
  }

  // --- Submit logic ---
  async onSubmit() {
    if (this.projectForm.invalid) return;

    const formValue = this.projectForm.value;

    const selectedCategories = this.categoriesFormArray.value
      .map((checked: boolean, i: number) => checked ? this.categories[i] : null)
      .filter((v: any) => v !== null);

    const selectedSkills = this.skillsFormArray.value
      .map((checked: boolean, i: number) => checked ? this.skills[i] : null)
      .filter((v: any) => v !== null);

    const newProject: Project = {
      ...formValue,
      categories: selectedCategories,
      skills: selectedSkills,
      // For now, using a placeholder until you set up Firebase Storage
      keyIMG: 'https://picsum.photos/400/300',
      gallery: []
    };

    try {
      await this.portfolioService.addProject(newProject);
      alert('Project added successfully!');
      this.projectForm.reset();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  }
}