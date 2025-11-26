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
    // Get selected categories
    const selectedCategories: string[] = this.categoriesFormArray.value
      .map((checked: boolean, i: number) => checked ? this.categories[i] : null)
      .filter((v: string | null): v is string => v !== null);

    // Get selected skills
    const selectedSkills: string[] = this.skillsFormArray.value
      .map((checked: boolean, i: number) => checked ? this.skills[i] : null)
      .filter((v: string | null): v is string => v !== null);

    const newProject: Project = {
      ...this.projectForm.value,
      categories: selectedCategories,
      skills: selectedSkills,
      id: 0, // Service will assign a proper ID
      gallery: [] // Can be converted to URLs later if needed
    };

    this.portfolioService.addProject(newProject);

    // Reset form after submission
    this.projectForm.reset();
    this.gallery = [];
  }
}
