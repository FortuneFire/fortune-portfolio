import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Export the Project interface
export interface Project {
  id: number;
  title: string;
  highlight: string;
  description: string;
  categories: string[];
  skills: string[];
  keyIMG?: string;
  gallery?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private _projects: Project[] = [];
  private _projects$ = new BehaviorSubject<Project[]>([]);
  projects$ = this._projects$.asObservable();

  constructor(private http: HttpClient) {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<Project[]>('assets/data/projects.json').subscribe({
      next: (projects) => {
        this._projects = projects;
        this._projects$.next(this._projects);
      },
      error: (err) => console.error('Failed to load projects:', err)
    });
  }

  addProject(project: Project) {
    project.id = this._projects.length ? Math.max(...this._projects.map(p => p.id)) + 1 : 1;
    this._projects.push(project);
    this._projects$.next(this._projects);
  }

  updateProject(updatedProject: Project) {
    const index = this._projects.findIndex(p => p.id === updatedProject.id);
    if (index > -1) {
      this._projects[index] = updatedProject;
      this._projects$.next(this._projects);
    }
  }

  deleteProject(projectId: number) {
    this._projects = this._projects.filter(p => p.id !== projectId);
    this._projects$.next(this._projects);
  }
}
