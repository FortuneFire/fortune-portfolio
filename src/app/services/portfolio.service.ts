import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
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
  private firestore: Firestore = inject(Firestore);
  private storage = getStorage(); // 🔹 Storage reference

  getProjects(): Observable<Project[]> {
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

  async deleteProject(projectId: string): Promise<void> {
    const projectRef = doc(this.firestore, 'projects', projectId);
    await deleteDoc(projectRef);
  }

  // 🔹 File upload
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  // 🔹 File delete
  async deleteFile(url: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, url);
      await deleteObject(storageRef);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }

  // ----- EDIT STATE -----
  private editingProject: Project | null = null;

  setEditingProject(project: Project | null) {
    this.editingProject = project;
  }

  getEditingProject() {
    return this.editingProject;
  }
}
