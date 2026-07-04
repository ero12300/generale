import { isFirebaseConfigured } from "@/lib/firebase/client";
import { firebaseRepository } from "@/lib/firebase/repository";
import type { DoorProject } from "@/lib/types";

const STORAGE_KEY = "portepro-projects";

function loadLocalProjects(): DoorProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DoorProject[];
  } catch {
    return [];
  }
}

function saveLocalProjects(projects: DoorProject[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProjectId(): string {
  return `porta-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useDemoMode(): boolean {
  return !isFirebaseConfigured();
}

/** Migra progetti localStorage su Firebase al primo accesso */
async function migrateLocalToFirebase(userId: string): Promise<void> {
  const local = loadLocalProjects();
  if (local.length === 0) return;

  const existing = await firebaseRepository.listProjects(userId);
  if (existing.length > 0) return;

  for (const project of local) {
    await firebaseRepository.upsertProject(userId, project);
  }
  localStorage.removeItem(STORAGE_KEY);
}

export const projectStore = {
  async listProjects(userId: string): Promise<DoorProject[]> {
    if (!isFirebaseConfigured() || userId === "demo-user") {
      return loadLocalProjects();
    }

    await migrateLocalToFirebase(userId);
    return firebaseRepository.listProjects(userId);
  },

  async upsertProject(userId: string, project: DoorProject): Promise<DoorProject> {
    if (!isFirebaseConfigured() || userId === "demo-user") {
      const projects = loadLocalProjects();
      const idx = projects.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        projects[idx] = project;
      } else {
        projects.unshift(project);
      }
      saveLocalProjects(projects);
      return project;
    }

    return firebaseRepository.upsertProject(userId, project);
  },

  async deleteProject(userId: string, projectId: string): Promise<void> {
    if (!isFirebaseConfigured() || userId === "demo-user") {
      saveLocalProjects(loadLocalProjects().filter((p) => p.id !== projectId));
      return;
    }

    await firebaseRepository.deleteProject(userId, projectId);
  },
};
