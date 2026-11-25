import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc
} from '@angular/fire/firestore';

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';

import { Observable } from 'rxjs';

// ----- PROJECT MODEL -----

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
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  // ----- GET PROJECTS -----

  getProjects(): Observable<Project[]> {
    const projectsCollection = collection(this.firestore, 'projects');

    return collectionData(projectsCollection, {
      idField: 'id'
    }) as Observable<Project[]>;
  }

  // ----- ADD PROJECT -----

  async addProject(project: Project): Promise<void> {
    const projectsCollection = collection(this.firestore, 'projects');

    const { id, ...data } = project;

    await addDoc(projectsCollection, data);
  }

  // ----- UPDATE PROJECT -----

  async updateProject(project: Project): Promise<void> {
    if (!project.id) {
      throw new Error('Cannot update project: Project ID is missing.');
    }

    const projectRef = doc(this.firestore, 'projects', project.id);

    const data = {
      title: project.title,
      highlight: project.highlight,
      description: project.description,
      categories: project.categories,
      skills: project.skills,
      ...(project.keyIMG !== undefined && {
        keyIMG: project.keyIMG
      }),
      ...(project.gallery !== undefined && {
        gallery: project.gallery
      })
    };

    await updateDoc(projectRef, data);
  }

  // ----- DELETE PROJECT AND ASSOCIATED IMAGES -----

  async deleteProject(projectId: string): Promise<void> {
    if (!projectId) {
      throw new Error('Project ID is required.');
    }

    const projectRef = doc(this.firestore, 'projects', projectId);

    // Retrieve project before deleting it
    const projectSnapshot = await getDoc(projectRef);

    if (!projectSnapshot.exists()) {
      throw new Error('Project not found.');
    }

    const project = projectSnapshot.data() as Project;

    // Collect associated image URLs
    const imageUrls = [
      project.keyIMG,
      ...(project.gallery || [])
    ].filter((url): url is string => !!url);

    // Remove duplicate URLs
    const uniqueImageUrls = [...new Set(imageUrls)];

    // Delete images from Firebase Storage
    const results = await Promise.allSettled(
      uniqueImageUrls.map(url => this.deleteFile(url))
    );

    // Report failed image deletions
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `Failed to delete project image: ${uniqueImageUrls[index]}`,
          result.reason
        );
      }
    });

    // Delete Firestore document
    await deleteDoc(projectRef);
  }

  // ----- FILE UPLOAD -----

  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);

    await uploadBytes(storageRef, file);

    return getDownloadURL(storageRef);
  }

  // ----- FILE DELETE -----

  async deleteFile(url: string): Promise<void> {
    if (!url) return;

    const storageRef = ref(this.storage, url);

    await deleteObject(storageRef);
  }

  // ----- EDIT STATE -----

  private editingProject: Project | null = null;

  setEditingProject(project: Project | null): void {
    this.editingProject = project;
  }

  getEditingProject(): Project | null {
    return this.editingProject;
  }
}
