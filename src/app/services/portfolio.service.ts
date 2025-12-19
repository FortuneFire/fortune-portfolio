import { Injectable, inject } from '@angular/core'; // 👈 Added inject
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Project {
  id?: string;
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
  // Using inject() here fixes the "outside of an Injection context" warning
  private firestore: Firestore = inject(Firestore);

  getProjects(): Observable<Project[]> {
    // Defining this inside the method ensures the instance is stable
    const projectsCollection = collection(this.firestore, 'projects');
    return collectionData(projectsCollection, { idField: 'id' }) as Observable<Project[]>;
  }

  async addProject(project: Project): Promise<void> {
    const projectsCollection = collection(this.firestore, 'projects');
    await addDoc(projectsCollection, project);
  }

  async updateProject(project: Project): Promise<void> {
    if (!project.id) return;
    const projectRef = doc(this.firestore, 'projects', project.id);
    const { id, ...data } = project;
    await updateDoc(projectRef, data as any);
  }
  // Inside your PortfolioService class
private editingProject: Project | null = null;

setEditingProject(project: Project | null) {
  this.editingProject = project;
}

getEditingProject() {
  return this.editingProject;
}

  async deleteProject(projectId: string): Promise<void> {
    const projectRef = doc(this.firestore, 'projects', projectId);
    await deleteDoc(projectRef);
  }
}