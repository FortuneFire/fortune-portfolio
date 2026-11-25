import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

import { PortfolioService, Project } from '../../services/portfolio.service';

/**
 * Master Categories
 * These are the baseline categories available for selection.
 */
const PORTFOLIO_CATEGORIES = [
  'Web Development',
  'Cloud & Infrastructure',
  'Automation'
];

/**
 * Predefined skills catalogue.
 */
const SKILLS_CATALOGUE: { category: string; skills: string[] }[] = [
  {
    category: 'Programming Languages',
    skills: ['PHP', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C#']
  },
  {
    category: 'Frontend',
    skills: ['Angular', 'React', 'Vue.js', 'HTML', 'CSS', 'SCSS', 'Tailwind CSS', 'Bootstrap']
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'Django', 'Laravel', 'REST APIs', 'GraphQL']
  },
  {
    category: 'CMS & E-commerce',
    skills: ['WordPress', 'WooCommerce', 'Shopify']
  },
  {
    category: 'Databases',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Firestore', 'Redis']
  },
  {
    category: 'Cloud & Infrastructure',
    skills: ['AWS', 'Docker', 'Linux', 'Nginx']
  },
  {
    category: 'Tools',
    skills: ['Git', 'GitHub', 'Postman', 'Figma']
  },
  {
    category: 'Development Practices',
    skills: [
      'API Integration',
      'Webhook Integration',
      'Database Design',
      'Authentication',
      'Role-Based Access Control',
      'Responsive Design',
      'CI/CD'
    ]
  }
];

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-projects.html',
  styleUrls: ['./manage-projects.css']
})
export class ManageProjectsComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private fb = inject(FormBuilder);

  projects: Project[] = [];
  selectedProject: Project | null = null;
  projectForm!: FormGroup;

  isUploading = false;

  // Main image
  keyImageFile: File | null = null;
  keyImagePreview: string | null = null;

  // Gallery images
  galleryFiles: File[] = [];
  removedGalleryImages: string[] = [];

  // ----- Categories selector -----
  categorySearch = '';
  private customCategories: string[] = [];
  private categoryPoolCache: Map<string, string> | null = null;

  // ----- Skills selector -----
  skillSearch = '';
  private customSkills: string[] = [];
  private skillPoolCache: Map<string, string> | null = null;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.portfolioService.getProjects().subscribe({
      next: data => {
        this.projects = data;
        // Invalidate both pools to include new data from DB
        this.invalidateCategoryPool();
        this.invalidateSkillPool();
      },
      error: err => {
        console.error('Error loading projects:', err);
      }
    });
  }

  editProject(project: Project): void {
    this.selectedProject = project;

    this.projectForm = this.fb.group({
      title: [project.title || ''],
      highlight: [project.highlight || ''],
      description: [project.description || ''],
      categories: this.fb.array(
        (project.categories || []).map(value => this.fb.control(value))
      ),
      skills: this.fb.array(
        (project.skills || []).map(value => this.fb.control(value))
      ),
      keyIMG: [project.keyIMG || ''],
      gallery: this.fb.array(
        (project.gallery || []).map(value => this.fb.control(value))
      )
    });

    this.keyImageFile = null;
    this.keyImagePreview = project.keyIMG || null;

    this.galleryFiles = [];
    this.removedGalleryImages = [];

    this.categorySearch = '';
    this.skillSearch = '';
  }

  get categories(): FormArray {
    return this.projectForm.get('categories') as FormArray;
  }

  get skills(): FormArray {
    return this.projectForm.get('skills') as FormArray;
  }

  get gallery(): FormArray {
    return this.projectForm.get('gallery') as FormArray;
  }

  // -----------------------------
  // Categories — merged pool & selector
  // -----------------------------

  private invalidateCategoryPool(): void {
    this.categoryPoolCache = null;
  }

  private buildCategoryPool(): Map<string, string> {
    if (this.categoryPoolCache) return this.categoryPoolCache;

    const pool = new Map<string, string>();

    // 1. Master list
    for (const name of PORTFOLIO_CATEGORIES) {
      pool.set(name.toLowerCase(), name);
    }

    // 2. Existing projects
    for (const project of this.projects) {
      for (const cat of project.categories || []) {
        const key = (cat || '').toLowerCase().trim();
        if (key && !pool.has(key)) pool.set(key, cat);
      }
    }

    // 3. Custom categories
    for (const cat of this.customCategories) {
      const key = cat.toLowerCase().trim();
      if (key && !pool.has(key)) pool.set(key, cat);
    }

    this.categoryPoolCache = pool;
    return pool;
  }

  get availableCategories(): string[] {
    return Array.from(this.buildCategoryPool().values())
      .sort((a, b) => a.localeCompare(b));
  }

  get filteredCategories(): string[] {
    if (!this.projectForm?.get('categories')) return [];

    const search = this.categorySearch.trim().toLowerCase();
    const selectedKeys = new Set(
      this.categories.controls.map(control =>
        String(control.value ?? '').toLowerCase().trim()
      )
    );

    return Array.from(this.buildCategoryPool().entries())
      .filter(([key]) => !selectedKeys.has(key))
      .filter(([, name]) => !search || name.toLowerCase().includes(search))
      .map(([, name]) => name)
      .sort((a, b) => a.localeCompare(b));
  }

  isCategorySelected(cat: string): boolean {
    if (!this.projectForm?.get('categories')) return false;
    const key = cat.toLowerCase().trim();
    return this.categories.controls.some(
      control => String(control.value ?? '').toLowerCase().trim() === key
    );
  }

  get canAddCustomCategory(): boolean {
    const search = this.categorySearch.trim();
    if (!search || this.isCategorySelected(search)) return false;
    return !this.buildCategoryPool().has(search.toLowerCase());
  }

  get categoryAlreadySelected(): boolean {
    const search = this.categorySearch.trim();
    return !!search && this.isCategorySelected(search);
  }

  addCategory(value: string): void {
    const cat = value.trim();
    if (!cat || this.isCategorySelected(cat)) return;

    this.categories.push(this.fb.control(cat));
    this.categorySearch = '';
  }

  addCustomCategory(): void {
    const cat = this.categorySearch.trim();
    if (!cat || !this.canAddCustomCategory) return;

    const key = cat.toLowerCase();
    if (!this.customCategories.some(c => c.toLowerCase() === key)) {
      this.customCategories.push(cat);
      this.invalidateCategoryPool();
    }

    this.addCategory(cat);
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index);
  }

  onCategorySearchEnter(): void {
    if (!this.categorySearch.trim()) return;
    const topMatch = this.filteredCategories[0];
    if (topMatch) {
      this.addCategory(topMatch);
    } else {
      this.addCustomCategory();
    }
  }

  // -----------------------------
  // Skills — merged pool & selector
  // -----------------------------

  private invalidateSkillPool(): void {
    this.skillPoolCache = null;
  }

  private buildSkillPool(): Map<string, string> {
    if (this.skillPoolCache) return this.skillPoolCache;

    const pool = new Map<string, string>();

    for (const group of SKILLS_CATALOGUE) {
      for (const name of group.skills) {
        const key = name.toLowerCase();
        if (!pool.has(key)) pool.set(key, name);
      }
    }

    for (const project of this.projects) {
      for (const skill of project.skills || []) {
        const key = (skill || '').toLowerCase().trim();
        if (key && !pool.has(key)) pool.set(key, skill);
      }
    }

    for (const skill of this.customSkills) {
      const key = skill.toLowerCase().trim();
      if (key && !pool.has(key)) pool.set(key, skill);
    }

    this.skillPoolCache = pool;
    return pool;
  }

  get availableSkills(): string[] {
    return Array.from(this.buildSkillPool().values())
      .sort((a, b) => a.localeCompare(b));
  }

  get filteredSkills(): string[] {
    if (!this.projectForm?.get('skills')) return [];

    const search = this.skillSearch.trim().toLowerCase();
    const selectedKeys = new Set(
      this.skills.controls.map(control =>
        String(control.value ?? '').toLowerCase().trim()
      )
    );

    return Array.from(this.buildSkillPool().entries())
      .filter(([key]) => !selectedKeys.has(key))
      .filter(([, name]) => !search || name.toLowerCase().includes(search))
      .map(([, name]) => name)
      .sort((a, b) => a.localeCompare(b));
  }

  isSkillSelected(skill: string): boolean {
    if (!this.projectForm?.get('skills')) return false;
    const key = skill.toLowerCase().trim();
    return this.skills.controls.some(
      control => String(control.value ?? '').toLowerCase().trim() === key
    );
  }

  get canAddCustomSkill(): boolean {
    const search = this.skillSearch.trim();
    if (!search || this.isSkillSelected(search)) return false;
    return !this.buildSkillPool().has(search.toLowerCase());
  }

  get skillAlreadySelected(): boolean {
    const search = this.skillSearch.trim();
    return !!search && this.isSkillSelected(search);
  }

  addSkill(value: string): void {
    const skill = value.trim();
    if (!skill || this.isSkillSelected(skill)) return;
    this.skills.push(this.fb.control(skill));
    this.skillSearch = '';
  }

  addCustomSkill(): void {
    const skill = this.skillSearch.trim();
    if (!skill || !this.canAddCustomSkill) return;

    const key = skill.toLowerCase();
    if (!this.customSkills.some(s => s.toLowerCase() === key)) {
      this.customSkills.push(skill);
      this.invalidateSkillPool();
    }

    this.addSkill(skill);
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onSkillSearchEnter(): void {
    if (!this.skillSearch.trim()) return;
    const topMatch = this.filteredSkills[0];
    if (topMatch) {
      this.addSkill(topMatch);
    } else {
      this.addCustomSkill();
    }
  }

  // -----------------------------
  // Main image
  // -----------------------------

  onKeyImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!this.isValidImage(file)) {
      alert('Please select a valid image file.');
      input.value = '';
      return;
    }

    this.keyImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.keyImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // -----------------------------
  // Gallery
  // -----------------------------

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter(file => this.isValidImage(file));

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were not added because they are not valid images.');
    }

    this.galleryFiles = [...this.galleryFiles, ...validFiles];
    input.value = '';
  }

  removeGalleryImage(index: number): void {
    const url = this.gallery.at(index)?.value;
    if (url) {
      this.removedGalleryImages.push(url);
    }
    this.gallery.removeAt(index);
  }

  removeNewGalleryImage(index: number): void {
    this.galleryFiles.splice(index, 1);
  }

  isValidImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  // -----------------------------
  // Cancel editing
  // -----------------------------

  cancelEdit(): void {
    this.selectedProject = null;
    this.projectForm = this.fb.group({});

    this.keyImageFile = null;
    this.keyImagePreview = null;

    this.galleryFiles = [];
    this.removedGalleryImages = [];

    this.categorySearch = '';
    this.skillSearch = '';
  }

  // -----------------------------
  // Save project
  // -----------------------------

  async saveProject(): Promise<void> {
    if (!this.selectedProject || !this.selectedProject.id) return;
    if (this.projectForm.invalid) {
      alert('Please complete the required fields.');
      return;
    }

    this.isUploading = true;
    const projectId = this.selectedProject.id;

    try {
      let keyImgUrl = this.selectedProject.keyIMG || '';

      if (this.keyImageFile) {
        const fileName = `${Date.now()}_${this.keyImageFile.name}`;
        const path = `projects/${projectId}/keyIMG/${fileName}`;
        keyImgUrl = await this.portfolioService.uploadFile(this.keyImageFile, path);
      }

      let galleryUrls: string[] = this.gallery.controls.map(c => c.value);

      if (this.galleryFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          this.galleryFiles.map((file, index) => {
            const fileName = `${Date.now()}_${index}_${file.name}`;
            const path = `projects/${projectId}/gallery/${fileName}`;
            return this.portfolioService.uploadFile(file, path);
          })
        );
        galleryUrls = [...galleryUrls, ...uploadedUrls];
      }

      const formValue = this.projectForm.getRawValue();

      const updates: Project = {
        ...this.selectedProject,
        title: formValue.title,
        highlight: formValue.highlight,
        description: formValue.description,
        categories: formValue.categories, // FormArray of strings
        skills: formValue.skills,         // FormArray of strings
        keyIMG: keyImgUrl,
        gallery: galleryUrls
      };

      await this.portfolioService.updateProject(updates);

      const imagesToDelete = [...this.removedGalleryImages];
      const previousKeyImage = this.selectedProject.keyIMG;

      if (this.keyImageFile && previousKeyImage && previousKeyImage !== keyImgUrl) {
        imagesToDelete.push(previousKeyImage);
      }

      const uniqueImages = [...new Set(imagesToDelete)];

      await Promise.allSettled(
        uniqueImages.map(url => this.portfolioService.deleteFile(url))
      );

      alert('Project updated successfully!');
      this.cancelEdit();
      this.loadProjects();

    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Check the console for details.');
    } finally {
      this.isUploading = false;
    }
  }

  // -----------------------------
  // Delete project
  // -----------------------------

  async deleteProject(projectId: string | undefined): Promise<void> {
    if (!projectId) return;

    const confirmed = confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await this.portfolioService.deleteProject(projectId);
      alert('Project deleted successfully.');
      this.loadProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Check the console for details.');
    }
  }
}
