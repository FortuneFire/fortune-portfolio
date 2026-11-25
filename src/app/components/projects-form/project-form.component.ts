import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../services/portfolio.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Predefined Categories
const PORTFOLIO_CATEGORIES = [
  'Web Development',
  'Cloud & Infrastructure',
  'Automation'
];

// Predefined skills catalogue
const SKILLS_CATALOGUE = [
  // Programming Languages
  'PHP', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C#',
  // Frontend
  'Angular', 'React', 'Vue.js', 'HTML', 'CSS', 'SCSS', 'Tailwind CSS', 'Bootstrap',
  // Backend
  'Node.js', 'Express.js', 'FastAPI', 'Django', 'Laravel', 'REST APIs', 'GraphQL',
  // CMS & E-commerce
  'WordPress', 'WooCommerce', 'Shopify',
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Firestore', 'Redis',
  // Cloud & Infrastructure
  'AWS', 'Docker', 'Linux', 'Nginx',
  // Tools
  'Git', 'GitHub', 'Postman', 'Figma',
  // Development Practices
  'API Integration', 'Webhook Integration', 'Database Design', 'Authentication', 'Role-Based Access Control', 'Responsive Design', 'CI/CD'
];

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  projects: Project[] = []; // Used to pull in old categories/skills

  // Categories Selector State
  categorySearch = '';
  customCategories: string[] = [];

  // Skills Selector State
  skillSearch = '';
  customSkills: string[] = [];

  // File Handling
  keyImageFile: File | null = null;
  galleryFiles: File[] = [];
  keyImagePreview: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadProjects();

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
      categories: this.fb.array([]), // Now holds string values
      skills: this.fb.array([]),     // Now holds string values
    });
  }

  private loadProjects(): void {
    this.portfolioService.getProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Error loading projects:', err)
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

    // 2. Map existing category strings to FormArray
    this.categoriesFormArray.clear();
    if (project.categories) {
      project.categories.forEach(cat => {
        this.categoriesFormArray.push(this.fb.control(cat));
      });
    }

    // 3. Map existing skill strings to FormArray
    this.skillsFormArray.clear();
    if (project.skills) {
      project.skills.forEach(skill => {
        this.skillsFormArray.push(this.fb.control(skill));
      });
    }
  }

  // --- Getters ---
  get categoriesFormArray() { return this.projectForm.get('categories') as FormArray; }
  get skillsFormArray() { return this.projectForm.get('skills') as FormArray; }
  get categories() { return this.categoriesFormArray; } // Alias for template
  get skills() { return this.skillsFormArray; }         // Alias for template

  // ==========================================
  // CATEGORY SELECTOR LOGIC
  // ==========================================

  private buildCategoryPool(): string[] {
    const pool = new Set<string>();

    // 1. Master list
    PORTFOLIO_CATEGORIES.forEach(c => pool.add(c));

    // 2. Categories across existing projects
    this.projects.forEach(p => {
      if (p.categories) p.categories.forEach(c => pool.add(c));
    });

    // 3. Custom categories created this session
    this.customCategories.forEach(c => pool.add(c));

    // 4. Existing categories for the current project (if editing)
    if (this.existingData?.categories) {
      this.existingData.categories.forEach(c => pool.add(c));
    }

    return Array.from(pool).sort((a, b) => a.localeCompare(b));
  }

  get filteredCategories(): string[] {
    if (!this.projectForm?.get('categories')) return [];

    const search = this.categorySearch.trim().toLowerCase();
    const selectedKeys = new Set(
      this.categoriesFormArray.controls.map(c => String(c.value ?? '').toLowerCase().trim())
    );

    return this.buildCategoryPool()
      .filter(cat => !selectedKeys.has(cat.toLowerCase()))
      .filter(cat => !search || cat.toLowerCase().includes(search));
  }

  isCategorySelected(cat: string): boolean {
    if (!this.projectForm?.get('categories')) return false;
    const key = cat.toLowerCase().trim();
    return this.categoriesFormArray.controls.some(c => String(c.value ?? '').toLowerCase().trim() === key);
  }

  get canAddCustomCategory(): boolean {
    const search = this.categorySearch.trim();
    if (!search || this.isCategorySelected(search)) return false;
    return !this.buildCategoryPool().some(c => c.toLowerCase() === search.toLowerCase());
  }

  addCategory(cat: string): void {
    if (!cat || this.isCategorySelected(cat)) return;
    this.categoriesFormArray.push(this.fb.control(cat.trim()));
    this.categorySearch = '';
  }

  addCustomCategory(): void {
    const cat = this.categorySearch.trim();
    if (!cat || !this.canAddCustomCategory) return;

    const key = cat.toLowerCase();
    if (!this.customCategories.some(c => c.toLowerCase() === key)) {
      this.customCategories.push(cat);
    }
    this.addCategory(cat);
  }

  removeCategory(index: number): void {
    this.categoriesFormArray.removeAt(index);
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

  // ==========================================
  // SKILLS SELECTOR LOGIC
  // ==========================================

  private buildSkillPool(): string[] {
    const pool = new Set<string>();

    // 1. Catalogue
    SKILLS_CATALOGUE.forEach(s => pool.add(s));

    // 2. Skills across existing projects
    this.projects.forEach(p => {
      if (p.skills) {
        p.skills.forEach(s => pool.add(s));
      }
    });

    // 3. Custom skills created this session
    this.customSkills.forEach(s => pool.add(s));

    // 4. Existing skills for the current project (if editing)
    if (this.existingData?.skills) {
      this.existingData.skills.forEach(s => pool.add(s));
    }

    return Array.from(pool).sort((a, b) => a.localeCompare(b));
  }

  get availableSkills(): string[] {
    return this.buildSkillPool();
  }

  get filteredSkills(): string[] {
    if (!this.projectForm?.get('skills')) return [];

    const search = this.skillSearch.trim().toLowerCase();
    const selectedKeys = new Set(
      this.skillsFormArray.controls.map(c => String(c.value ?? '').toLowerCase().trim())
    );

    return this.availableSkills
      .filter(skill => !selectedKeys.has(skill.toLowerCase()))
      .filter(skill => !search || skill.toLowerCase().includes(search));
  }

  isSkillSelected(skill: string): boolean {
    if (!this.projectForm?.get('skills')) return false;
    const key = skill.toLowerCase().trim();
    return this.skillsFormArray.controls.some(c => String(c.value ?? '').toLowerCase().trim() === key);
  }

  get canAddCustomSkill(): boolean {
    const search = this.skillSearch.trim();
    if (!search || this.isSkillSelected(search)) return false;

    return !this.availableSkills.some(s => s.toLowerCase() === search.toLowerCase());
  }

  addSkill(skill: string): void {
    if (!skill || this.isSkillSelected(skill)) return;
    this.skillsFormArray.push(this.fb.control(skill.trim()));
    this.skillSearch = '';
  }

  addCustomSkill(): void {
    const skill = this.skillSearch.trim();
    if (!skill || !this.canAddCustomSkill) return;

    const key = skill.toLowerCase();
    if (!this.customSkills.some(s => s.toLowerCase() === key)) {
      this.customSkills.push(skill);
    }
    this.addSkill(skill);
  }

  removeSkill(index: number): void {
    this.skillsFormArray.removeAt(index);
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

  // --- Image Selection ---
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.keyImageFile = file;
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

      // 2. Handle Gallery
      let galleryUrls = this.existingData?.gallery || [];
      if (this.galleryFiles.length > 0) {
        const newGalleryUrls = await Promise.all(
          this.galleryFiles.map(file => this.uploadFile(file, 'gallery'))
        );
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }

      // 3. Get the arrays directly from the form (no more boolean mapping!)
      const selectedCats = this.projectForm.value.categories;
      const selectedSkills = this.projectForm.value.skills;

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

    this.categorySearch = '';
    this.skillSearch = '';

    this.portfolioService.setEditingProject(null);

    // Clear both form arrays
    this.categoriesFormArray.clear();
    this.skillsFormArray.clear();
  }
}
