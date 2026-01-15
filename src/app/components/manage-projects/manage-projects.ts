import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { PortfolioService, Project } from '../../services/portfolio.service';

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

  // Key image
  keyImageFile: File | null = null;
  keyImagePreview: string | null = null;

  // Gallery
  galleryFiles: File[] = [];

  isUploading = false;

  ngOnInit(): void {
    this.loadProjects();
  }

  /** Load all projects from Firestore */
  loadProjects() {
    this.portfolioService.getProjects().subscribe({
      next: data => this.projects = data,
      error: err => console.error('Error loading projects', err)
    });
  }

  /** ----- FORM MANAGEMENT ----- */
  editProject(project: Project) {
    this.selectedProject = project;

    this.projectForm = this.fb.group({
      title: [project.title],
      highlight: [project.highlight],
      description: [project.description],
      categories: this.fb.array(project.categories || []),
      skills: this.fb.array(project.skills || []),
      keyIMG: [project.keyIMG || ''],
      gallery: this.fb.array(project.gallery || [])
    });

    this.keyImagePreview = project.keyIMG || null;
    this.galleryFiles = [];
  }

  get categories() { return this.projectForm.get('categories') as FormArray; }
  get skills() { return this.projectForm.get('skills') as FormArray; }
  get gallery() { return this.projectForm.get('gallery') as FormArray; }

  addCategory(value: string) { if (value) this.categories.push(this.fb.control(value)); }
  addSkill(value: string) { if (value) this.skills.push(this.fb.control(value)); }
  addGalleryImage(url: string) { if (url) this.gallery.push(this.fb.control(url)); }

  removeGalleryImage(index: number) {
    const url = this.gallery.at(index)?.value;
    if (url) {
      this.portfolioService.deleteFile(url); // delete from storage
    }
    this.gallery.removeAt(index);
  }

  cancelEdit() {
    this.selectedProject = null;
    this.projectForm = this.fb.group({});
    this.keyImageFile = null;
    this.keyImagePreview = null;
    this.galleryFiles = [];
  }

  /** ----- FILE HANDLERS ----- */
  onKeyImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.keyImageFile = file;
      const reader = new FileReader();
      reader.onload = () => this.keyImagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onGallerySelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.galleryFiles = Array.from(files);
    }
  }

  /** ----- SAVE / UPLOAD ----- */
  async saveProject() {
    if (!this.selectedProject) return;
    this.isUploading = true;

    try {
      // Upload key image if changed
      let keyImgUrl = this.selectedProject.keyIMG || '';
      if (this.keyImageFile && this.selectedProject.id) {
        const path = `projects/${this.selectedProject.id}/keyIMG/${Date.now()}_${this.keyImageFile.name}`;
        keyImgUrl = await this.portfolioService.uploadFile(this.keyImageFile, path);
      }

      // Upload gallery images if any
      let galleryUrls = this.gallery.controls.map(ctrl => ctrl.value);
      if (this.galleryFiles.length > 0 && this.selectedProject.id) {
        const uploadedUrls = await Promise.all(
          this.galleryFiles.map(file =>
            this.portfolioService.uploadFile(file, `projects/${this.selectedProject!.id}/gallery/${Date.now()}_${file.name}`)
          )
        );
        galleryUrls = [...galleryUrls, ...uploadedUrls];
      }

      // Update project in Firestore
      const updates: Project = {
        ...this.selectedProject,
        ...this.projectForm.value,
        keyIMG: keyImgUrl,
        gallery: galleryUrls
      };

      await this.portfolioService.updateProject(updates);

      alert('Project updated successfully!');
      this.cancelEdit();
      this.loadProjects();

    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Check console.');
    } finally {
      this.isUploading = false;
    }
  }

  /** ----- DELETE PROJECT ----- */
  async deleteProject(projectId: string | undefined) {
    if (!projectId) return;
    if (confirm('Are you sure you want to delete this project?')) {
      await this.portfolioService.deleteProject(projectId);
      this.loadProjects();
    }
  }
}
