import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../services/portfolio.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  private storage = getStorage();

  // State Management
  projectForm!: FormGroup;
  editingId: string | null = null;
  existingData: Project | null = null;
  isUploading = false;

  // Master Data
  categories: string[] = ['Web Development', 'Web Design', 'Graphic Design', 'Mobile App'];
  skills: string[] = ['Angular', 'CSS', 'HTML', 'JS', 'Firebase', 'TypeScript', 'Node.js', 'WordPress'];

  // File Handling
  keyImageFile: File | null = null;
  galleryFiles: File[] = [];
  keyImagePreview: string | null = null;

  ngOnInit(): void {
    this.initForm();

    // Check Service for a project to edit
    const projectToEdit = this.portfolioService.getEditingProject();
    if (projectToEdit) {
      this.setupEditMode(projectToEdit);
    }
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      highlight: ['', Validators.required],
      description: ['', Validators.required],
      categories: this.fb.array(this.categories.map(() => this.fb.control(false))),
      skills: this.fb.array(this.skills.map(() => this.fb.control(false))),
    });
  }

  private setupEditMode(project: Project): void {
    this.editingId = project.id || null;
    this.existingData = project;
    this.keyImagePreview = project.keyIMG || null;

    // 1. Patch basic fields
    this.projectForm.patchValue({
      title: project.title,
      highlight: project.highlight,
      description: project.description
    });

    // 2. Map existing category strings to FormArray booleans
    const categoryValues = this.categories.map(cat => 
      project.categories ? project.categories.includes(cat) : false
    );
    this.categoriesFormArray.setValue(categoryValues);

    // 3. Map existing skill strings to FormArray booleans
    const skillValues = this.skills.map(skill => 
      project.skills ? project.skills.includes(skill) : false
    );
    this.skillsFormArray.setValue(skillValues);
  }

  // --- Getters ---
  get categoriesFormArray() { return this.projectForm.get('categories') as FormArray; }
  get skillsFormArray() { return this.projectForm.get('skills') as FormArray; }

  // --- Image Selection ---
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.keyImageFile = file;
      // Generate a local preview URL
      const reader = new FileReader();
      reader.onload = () => (this.keyImagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onGallerySelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.galleryFiles = Array.from(files);
    }
  }

  // --- Firebase Storage Upload ---
  private async uploadFile(file: File, path: string): Promise<string> {
    const filePath = `projects/${Date.now()}_${path}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // --- Submission ---
  async onSubmit() {
    // If we're not editing, a main image is mandatory. 
    // If we ARE editing, we can reuse the existing one.
    if (this.projectForm.invalid || (!this.keyImageFile && !this.editingId)) {
      alert('Please fill all required fields.');
      return;
    }

    this.isUploading = true;

    try {
      // 1. Handle Main Image
      let keyImgUrl = this.existingData?.keyIMG || '';
      if (this.keyImageFile) {
        keyImgUrl = await this.uploadFile(this.keyImageFile, 'main');
      }

      // 2. Handle Gallery (Appends new uploads to existing if editing)
      let galleryUrls = this.existingData?.gallery || [];
      if (this.galleryFiles.length > 0) {
        const newGalleryUrls = await Promise.all(
          this.galleryFiles.map(file => this.uploadFile(file, 'gallery'))
        );
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }

      // 3. Convert FormArray booleans back to string arrays
      const selectedCats = this.projectForm.value.categories
        .map((checked: boolean, i: number) => checked ? this.categories[i] : null)
        .filter((v: any) => v !== null);

      const selectedSkills = this.projectForm.value.skills
        .map((checked: boolean, i: number) => checked ? this.skills[i] : null)
        .filter((v: any) => v !== null);

      // 4. Construct Data Object
      const projectData: Project = {
        title: this.projectForm.value.title,
        highlight: this.projectForm.value.highlight,
        description: this.projectForm.value.description,
        categories: selectedCats,
        skills: selectedSkills,
        keyIMG: keyImgUrl,
        gallery: galleryUrls
      };

      // 5. Firestore Action
      if (this.editingId) {
        await this.portfolioService.updateProject({ ...projectData, id: this.editingId });
        alert('Project updated successfully!');
      } else {
        await this.portfolioService.addProject(projectData);
        alert('Project added successfully!');
      }

      this.resetForm();

    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Check console for details.');
    } finally {
      this.isUploading = false;
    }
  }

  resetForm(): void {
    this.projectForm.reset();
    this.editingId = null;
    this.existingData = null;
    this.keyImageFile = null;
    this.keyImagePreview = null;
    this.galleryFiles = [];
    this.portfolioService.setEditingProject(null);
    
    // Explicitly reset the form arrays to false
    this.categoriesFormArray.controls.forEach(c => c.setValue(false));
    this.skillsFormArray.controls.forEach(c => c.setValue(false));
  }
}